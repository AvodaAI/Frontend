//src/utils/logger.ts

export const log = (...args: any[]) => {
    if (process.env.NODE_ENV === "development") {
        console.log(...args);
    }
};