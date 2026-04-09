
export const nameValidator = (val: string): boolean | string => 
    /^[a-zA-Z\s]{2,}$/.test(val) || "Name must be at least 2 characters and contain only letters.";

export const emailValidator = (val: string): boolean | string => 
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || "Please enter a valid email address (e.g., name@domain.com).";

export const phoneValidator = (val: string): boolean | string => 
    /^\d{10}$/.test(val) || "Phone number must be exactly 10 digits.";

export const optionalValidator = (validator: (val: string) => boolean | string) => {
    return (val: string) => val === "" || validator(val);
};


