// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.7.0 < 0.9.0;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

contract SwapMultiHop{
    ISwapRouter public constant swapRouter =
        ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

    address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address public constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

    function swapExactInputMultihop(uint amountIn) external returns (uint amountOut){
        TransferHelper.safeTransferFrom(WETH9, msg.sender, address(this), amountIn);

        TransferHelper.safeApprove(WETH9, address(swapRouter), amountIn);

        ISwapRouter.ExactInputParams memory params = ISwapRouter.ExactInputParams({
            path: abi.encodePacked(
                WETH9,
                uint24(3000),
                USDC, 
                uint24(100),
                DAI
            ),
            recipient: msg.sender,
            deadline: block.timestamp,
            amountIn: amountIn,
            amountOutMinimum: 0
        });
        amountOut = swapRouter.exactInput(params);
    }

    function swapExactOutputMultihop(uint amountOut, uint amountInMaximum) external returns (uint amountIn){
        TransferHelper.safeTransferFrom(WETH9, msg.sender, address(this), amountInMaximum);

        TransferHelper.safeApprove(WETH9, address(swapRouter), amountInMaximum);
        ISwapRouter.ExactOutputParams memory params = ISwapRouter.ExactOutputParams({
            path: abi.encodePacked(
                DAI,
                uint24(100),
                USDC,
                uint24(3000),
                WETH9
            ),
            recipient: msg.sender,
            deadline: block.timestamp,
            amountOut: amountOut,
            amountInMaximum: amountInMaximum
        });

        amountIn = swapRouter.exactOutput(params);

        if(amountIn < amountInMaximum){
            TransferHelper.safeApprove(WETH9, address(swapRouter), 0);
            TransferHelper.safeTransferFrom(WETH9, address(this), msg.sender, amountInMaximum - amountIn);
        }
    }

}

