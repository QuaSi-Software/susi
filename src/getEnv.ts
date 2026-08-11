let config: Record<string, string> = {};
try {
    const configReq = await fetch('/config.json');
    config = await configReq.json();
} catch (e) {
    console.error('Failed to load config.json', e);
}

export function getEnv(name: string): string {
    return config?.[name] || import.meta.env[name] || '';
}