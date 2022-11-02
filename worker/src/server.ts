import { Server } from '@chainlink/ccip-read-server';
import { BytesLike, ethers } from 'ethers';
import { hexConcat, Result } from 'ethers/lib/utils';

const IResolverService_abi = [
    {
        inputs: [
            {
                internalType: 'bytes',
                name: 'name',
                type: 'bytes',
            },
            {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
            },
        ],
        name: 'resolve',
        outputs: [
            {
                internalType: 'bytes',
                name: 'result',
                type: 'bytes',
            },
            {
                internalType: 'uint64',
                name: 'expires',
                type: 'uint64',
            },
            {
                internalType: 'bytes',
                name: 'sig',
                type: 'bytes',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
const Resolver_abi = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
            {
                indexed: true,
                internalType: 'uint256',
                name: 'contentType',
                type: 'uint256',
            },
        ],
        name: 'ABIChanged',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'a',
                type: 'address',
            },
        ],
        name: 'AddrChanged',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'coinType',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'bytes',
                name: 'newAddress',
                type: 'bytes',
            },
        ],
        name: 'AddressChanged',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
            {
                indexed: false,
                internalType: 'bytes32',
                name: 'hash',
                type: 'bytes32',
            },
        ],
        name: 'ContentChanged',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
            {
                indexed: false,
                internalType: 'bytes',
                name: 'hash',
                type: 'bytes',
            },
        ],
        name: 'ContenthashChanged',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
            {
                indexed: false,
                internalType: 'bytes',
                name: 'name',
                type: 'bytes',
            },
            {
                indexed: false,
                internalType: 'uint16',
                name: 'resource',
                type: 'uint16',
            },
            {
                indexed: false,
                internalType: 'bytes',
                name: 'record',
                type: 'bytes',
            },
        ],
        name: 'DNSRecordChanged',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
            {
                indexed: false,
                internalType: 'bytes',
                name: 'name',
                type: 'bytes',
            },
            {
                indexed: false,
                internalType: 'uint16',
                name: 'resource',
                type: 'uint16',
            },
        ],
        name: 'DNSRecordDeleted',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
        ],
        name: 'DNSZoneCleared',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
            {
                indexed: false,
                internalType: 'bytes',
                name: 'lastzonehash',
                type: 'bytes',
            },
            {
                indexed: false,
                internalType: 'bytes',
                name: 'zonehash',
                type: 'bytes',
            },
        ],
        name: 'DNSZonehashChanged',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
            {
                indexed: true,
                internalType: 'bytes4',
                name: 'interfaceID',
                type: 'bytes4',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'implementer',
                type: 'address',
            },
        ],
        name: 'InterfaceChanged',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
            {
                indexed: false,
                internalType: 'string',
                name: 'name',
                type: 'string',
            },
        ],
        name: 'NameChanged',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
            {
                indexed: false,
                internalType: 'bytes32',
                name: 'x',
                type: 'bytes32',
            },
            {
                indexed: false,
                internalType: 'bytes32',
                name: 'y',
                type: 'bytes32',
            },
        ],
        name: 'PubkeyChanged',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
            {
                indexed: true,
                internalType: 'string',
                name: 'indexedKey',
                type: 'string',
            },
            {
                indexed: false,
                internalType: 'string',
                name: 'key',
                type: 'string',
            },
        ],
        name: 'TextChanged',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
            {
                internalType: 'uint256',
                name: 'contentTypes',
                type: 'uint256',
            },
        ],
        name: 'ABI',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
        ],
        name: 'addr',
        outputs: [
            {
                internalType: 'address payable',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
            {
                internalType: 'uint256',
                name: 'coinType',
                type: 'uint256',
            },
        ],
        name: 'addr',
        outputs: [
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
        ],
        name: 'content',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
        ],
        name: 'contenthash',
        outputs: [
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
            {
                internalType: 'bytes32',
                name: 'name',
                type: 'bytes32',
            },
            {
                internalType: 'uint16',
                name: 'resource',
                type: 'uint16',
            },
        ],
        name: 'dnsRecord',
        outputs: [
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
            {
                internalType: 'bytes4',
                name: 'interfaceID',
                type: 'bytes4',
            },
        ],
        name: 'interfaceImplementer',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes[]',
                name: 'data',
                type: 'bytes[]',
            },
        ],
        name: 'multicall',
        outputs: [
            {
                internalType: 'bytes[]',
                name: 'results',
                type: 'bytes[]',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
        ],
        name: 'multihash',
        outputs: [
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
        ],
        name: 'name',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
        ],
        name: 'pubkey',
        outputs: [
            {
                internalType: 'bytes32',
                name: 'x',
                type: 'bytes32',
            },
            {
                internalType: 'bytes32',
                name: 'y',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
            {
                internalType: 'uint256',
                name: 'contentType',
                type: 'uint256',
            },
            {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
            },
        ],
        name: 'setABI',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
            {
                internalType: 'uint256',
                name: 'coinType',
                type: 'uint256',
            },
            {
                internalType: 'bytes',
                name: 'a',
                type: 'bytes',
            },
        ],
        name: 'setAddr',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
            {
                internalType: 'address',
                name: 'addr',
                type: 'address',
            },
        ],
        name: 'setAddr',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
            {
                internalType: 'bytes32',
                name: 'hash',
                type: 'bytes32',
            },
        ],
        name: 'setContent',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
            {
                internalType: 'bytes',
                name: 'hash',
                type: 'bytes',
            },
        ],
        name: 'setContenthash',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
            {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
            },
        ],
        name: 'setDnsrr',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
            {
                internalType: 'bytes4',
                name: 'interfaceID',
                type: 'bytes4',
            },
            {
                internalType: 'address',
                name: 'implementer',
                type: 'address',
            },
        ],
        name: 'setInterface',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
            {
                internalType: 'bytes',
                name: 'hash',
                type: 'bytes',
            },
        ],
        name: 'setMultihash',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
            {
                internalType: 'string',
                name: '_name',
                type: 'string',
            },
        ],
        name: 'setName',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
            {
                internalType: 'bytes32',
                name: 'x',
                type: 'bytes32',
            },
            {
                internalType: 'bytes32',
                name: 'y',
                type: 'bytes32',
            },
        ],
        name: 'setPubkey',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
            {
                internalType: 'string',
                name: 'key',
                type: 'string',
            },
            {
                internalType: 'string',
                name: 'value',
                type: 'string',
            },
        ],
        name: 'setText',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes4',
                name: 'interfaceID',
                type: 'bytes4',
            },
        ],
        name: 'supportsInterface',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'pure',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
            {
                internalType: 'string',
                name: 'key',
                type: 'string',
            },
        ],
        name: 'text',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
        ],
        name: 'zonehash',
        outputs: [
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];

const Resolver = new ethers.utils.Interface(Resolver_abi);

interface DatabaseResult {
    result: any[];
    ttl: number;
}

type PromiseOrResult<T> = T | Promise<T>;

export interface Database {
    addr(
        name: string,
        coinType: number
    ): PromiseOrResult<{ addr: string; ttl: number }>;
    text(
        name: string,
        key: string
    ): PromiseOrResult<{ value: string; ttl: number }>;
    contenthash(
        name: string
    ): PromiseOrResult<{ contenthash: string; ttl: number }>;
}

function decodeDnsName(dnsname: Buffer) {
    const labels = [];
    let index = 0;

    while (true) {
        const length = dnsname.readUInt8(index);

        if (length === 0) break;

        labels.push(
            dnsname.slice(index + 1, index + length + 1).toString('utf8')
        );
        index += length + 1;
    }

    return labels.join('.');
}

const queryHandlers: {
    [key: string]: (
        database: Database,
        name: string,
        arguments_: Result
    ) => Promise<DatabaseResult>;
} = {
    'addr(bytes32)': async (database, name, _arguments) => {
        const { addr, ttl } = await database.addr(name, 60); // ETH COIN TYPE

        return { result: [addr], ttl };
    },
    'addr(bytes32,uint256)': async (database, name, arguments_) => {
        const { addr, ttl } = await database.addr(name, arguments_[0]);

        return { result: [addr], ttl };
    },
    'text(bytes32,string)': async (database, name, arguments_) => {
        const { value, ttl } = await database.text(name, arguments_[0]);

        return { result: [value], ttl };
    },
    'contenthash(bytes32)': async (database, name, _arguments) => {
        const { contenthash, ttl } = await database.contenthash(name);

        return { result: [contenthash], ttl };
    },
};

async function query(
    database: Database,
    name: string,
    data: string
): Promise<{ result: BytesLike; validUntil: number }> {
    // Parse the data nested inside the second argument to `resolve`
    const { signature, args } = Resolver.parseTransaction({ data });

    if (ethers.utils.nameprep(name) !== name) {
        throw new Error('Name must be normalised');
    }

    if (ethers.utils.namehash(name) !== args[0]) {
        throw new Error('Name does not match namehash');
    }

    const handler = queryHandlers[signature];

    if (handler === undefined) {
        throw new Error(`Unsupported query function ${signature}`);
    }

    const { result, ttl } = await handler(database, name, args.slice(1));

    return {
        result: Resolver.encodeFunctionResult(signature, result),
        validUntil: Math.floor(Date.now() / 1000 + ttl),
    };
}

export function makeServer(
    signer: ethers.utils.SigningKey,
    database: Database
) {
    const server = new Server();

    server.add(IResolverService_abi, [
        {
            type: 'resolve',
            func: async ([encodedName, data]: Result, request) => {
                const name = decodeDnsName(
                    Buffer.from(encodedName.slice(2), 'hex')
                );
                // Query the database
                const { result, validUntil } = await query(
                    database,
                    name,
                    data
                );

                // Hash and sign the response
                const messageHash = ethers.utils.solidityKeccak256(
                    ['bytes', 'address', 'uint64', 'bytes32', 'bytes32'],
                    [
                        '0x1900',
                        request?.to,
                        validUntil,
                        ethers.utils.keccak256(request?.data || '0x'),
                        ethers.utils.keccak256(result),
                    ]
                );
                const sig = signer.signDigest(messageHash);
                const sigData = hexConcat([sig.r, sig._vs]);

                return [result, validUntil, sigData];
            },
        },
    ]);

    return server;
}

export function makeApp(signer: ethers.utils.SigningKey, database: Database) {
    return makeServer(signer, database);
}
