const X_ENV_HEADER = 'X-ENV';
const TEST_API = 'assets/img/favicon.png';

/**
 * Returns current environment form X-ENV header variable
 */
export function getServerEnvironment(): string | null {
    try {
        const req = new XMLHttpRequest();
        req.open('GET', String(TEST_API), false);
        req.send(null);
        const header = req.getResponseHeader(X_ENV_HEADER);
        return header.toLocaleLowerCase();
    } catch (e) {
        return null;
    }
}
