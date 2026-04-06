
// export class ConflictError extends Error {
//     conflictError: string;

//     constructor(message: string, conflictError: string) {
//         super(message);
//         this.name = "ConflictError";
//         this.conflictError = conflictError;

//     }
// }

// export class ConflictError extends Error {
//     conflictError: string;
//     field: string | undefined;

//     constructor(message: string, conflictError: string, field?: string) {
//         super(message);
//         this.name = "ConflictError";
//         this.conflictError = conflictError;
//         this.field = field;

//         // This helps with debugging in Node.js
//         Object.setPrototypeOf(this, ConflictError.prototype);
//     }
// }

export class ConflictError extends Error {
    conflictError: string;

    constructor(message: string, conflictError: string) {
        super(message);
        this.name = "ConflictError";
        this.conflictError = conflictError;

    }
}