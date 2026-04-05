export class ConflictError extends Error {
    conflictError;
    constructor(message, conflictError) {
        super(message);
        this.name = "ConflictError";
        this.conflictError = conflictError;
    }
}
//# sourceMappingURL=conflict.error.js.map