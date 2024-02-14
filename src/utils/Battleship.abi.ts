export default [
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "games",
    "outputs": [
      {
        "name": "status",
        "type": "uint8"
      },
      {
        "name": "gridSize",
        "type": "uint8"
      },
      {
        "name": "targetIndex",
        "type": "uint8"
      },
      {
        "name": "owner",
        "type": "address"
      },
      {
        "name": "challenger",
        "type": "address"
      },
      {
        "name": "turn",
        "type": "address"
      },
      {
        "name": "winner",
        "type": "address"
      },
      {
        "name": "funds",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "player",
        "type": "address"
      }
    ],
    "name": "getPlayerGames",
    "outputs": [
      {
        "name": "",
        "type": "uint256[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "value",
        "type": "uint8"
      },
      {
        "name": "increment",
        "type": "uint8"
      }
    ],
    "name": "notSafeMath",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "toggleEmergency",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "gameId",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "gridSize",
        "type": "uint8"
      },
      {
        "name": "secret",
        "type": "bytes32"
      }
    ],
    "name": "createGame",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "value",
        "type": "uint8"
      },
      {
        "name": "increment",
        "type": "uint8"
      }
    ],
    "name": "safeMath",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "gameId",
        "type": "uint256"
      },
      {
        "name": "index",
        "type": "uint8"
      }
    ],
    "name": "attack",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "gameId",
        "type": "uint256"
      },
      {
        "name": "index",
        "type": "uint8"
      },
      {
        "name": "hit",
        "type": "bool"
      }
    ],
    "name": "counterAttack",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "gameId",
        "type": "uint256"
      },
      {
        "name": "player",
        "type": "address"
      }
    ],
    "name": "getGameTarget",
    "outputs": [
      {
        "name": "",
        "type": "int8[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "gameId",
        "type": "uint256"
      },
      {
        "name": "secret",
        "type": "bytes32"
      }
    ],
    "name": "joinGame",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "gameId",
        "type": "uint256"
      },
      {
        "name": "player",
        "type": "address"
      }
    ],
    "name": "getGameOcean",
    "outputs": [
      {
        "name": "",
        "type": "int8[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "gameId",
        "type": "uint256"
      },
      {
        "name": "ships",
        "type": "string"
      },
      {
        "name": "salt",
        "type": "string"
      }
    ],
    "name": "reveal",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "gameId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "gridSize",
        "type": "uint8"
      },
      {
        "indexed": false,
        "name": "bet",
        "type": "uint256"
      }
    ],
    "name": "GameCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "gameId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "challenger",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "bet",
        "type": "uint256"
      }
    ],
    "name": "GameJoined",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "gameId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "name": "attacker",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "defender",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "Attack",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "gameId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "name": "attacker",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "defender",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "index",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "hit",
        "type": "bool"
      }
    ],
    "name": "AttackResult",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "gameId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "name": "winner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "opponent",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "void",
        "type": "bool"
      }
    ],
    "name": "GameFinished",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "gameId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "name": "revealer",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "opponent",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "ships",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "void",
        "type": "bool"
      }
    ],
    "name": "GameRevealed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  }
] as const