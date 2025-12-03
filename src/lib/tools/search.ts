import { tavily } from '@tavily/core';

export class SearchTool {
    private client: any = null;

    private getClient() {
        if (!this.client) {
            const apiKey = process.env.TAVILY_API_KEY;
            if (!apiKey) {
                return null;
            }
            this.client = tavily({ apiKey });
        }
        return this.client;
    }

    async search(query: string): Promise<string> {
        const client = this.getClient();

        if (!client) {
            return 'Search is disabled. Configure TAVILY_API_KEY to enable.';
        }

        try {
            const response = await client.search(query, {
                searchDepth: 'basic',
                maxResults: 3,
            });

            const results = response.results.map((result: any) =>
                `- ${result.title}: ${result.content} (${result.url})`
            ).join('\n');

            return `Search Results for "${query}":\n${results}`;
        } catch (error) {
            console.error('Search error:', error);
            return `Failed to perform search: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }
}

export const searchTool = new SearchTool();
