import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { 
      prompt?: string
      stream?: boolean
      documents?: string[]
      images?: string[]
    }
    const { prompt, stream = false } = body
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const contractCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GeneratedContract is ERC20, Ownable {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10**decimals());
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}`

    // If streaming is requested, return a streaming response
    if (stream) {
      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder()
          const chunks = contractCode.split('\n')
          
          for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i] + '\n'
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ content: chunk, done: false })}\n\n`)
            )
            await new Promise(resolve => setTimeout(resolve, 50)) // Simulate streaming delay
          }
          
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ content: '', done: true })}\n\n`)
          )
          controller.close()
        }
      })

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    }

    // Non-streaming response
    const generatedContract = {
      code: contractCode,
      security: {
        score: 95,
        issues: [
          { severity: "info", message: "Consider adding pausable functionality" }
        ]
      }
    }

    return NextResponse.json({
      success: true,
      contract: generatedContract,
      message: "Contract generated successfully"
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
