export function getProviderName(apiUrl: string) {
	if (apiUrl.includes("api.openai.com")) return "openai";
	if (apiUrl.includes("azure.com")) return "azure";
	if (apiUrl.includes("api.anthropic.com")) return "anthropic";
	if (apiUrl.includes("api.cohere.ai")) return "cohere";
	if (apiUrl.includes("api.perplexity.ai")) return "perplexity";
	if (apiUrl.includes("api.mistral.ai")) return "mistral";
	if (apiUrl.includes(":11434") || apiUrl.includes("ollama")) return "ollama";
	if (apiUrl.includes("api.deepinfra.com")) return "deepinfra";
	if (apiUrl.includes("generativelanguage.googleapis.com")) return "gemini";
	if (apiUrl.includes("openrouter.ai")) return "openrouter";
	if (apiUrl.includes("api.z.ai")) return "zai";
	if (apiUrl.includes("api.minimax.io")) return "minimax";
	return "custom";
}

export async function selectAIProvider(config: { apiUrl: string; apiKey: string }) {
	const providerName = getProviderName(config.apiUrl);

	switch (providerName) {
		case "openai": {
			const { createOpenAI } = await import("@ai-sdk/openai");
			return createOpenAI({
				apiKey: config.apiKey,
				baseURL: config.apiUrl,
			});
		}
		case "azure": {
			// Azure OpenAI-compatible endpoints already include /v1 in the path.
			// Using createAzure with such URLs causes a doubled /v1//v1/ suffix.
			if (config.apiUrl.includes("/v1")) {
				const { createOpenAICompatible } = await import("@ai-sdk/openai-compatible");
				return createOpenAICompatible({
					name: "azure",
					baseURL: config.apiUrl,
					headers: {
						"api-key": config.apiKey,
						Authorization: `Bearer ${config.apiKey}`,
					},
				});
			}
			const { createAzure } = await import("@ai-sdk/azure");
			return createAzure({
				apiKey: config.apiKey,
				baseURL: config.apiUrl,
			});
		}
		case "anthropic": {
			const { createAnthropic } = await import("@ai-sdk/anthropic");
			return createAnthropic({
				apiKey: config.apiKey,
				baseURL: config.apiUrl,
			});
		}
		case "cohere": {
			const { createCohere } = await import("@ai-sdk/cohere");
			return createCohere({
				baseURL: config.apiUrl,
				apiKey: config.apiKey,
			});
		}
		case "perplexity": {
			const { createOpenAICompatible } = await import("@ai-sdk/openai-compatible");
			return createOpenAICompatible({
				name: "perplexity",
				baseURL: config.apiUrl,
				headers: {
					Authorization: `Bearer ${config.apiKey}`,
				},
			});
		}
		case "mistral": {
			const { createMistral } = await import("@ai-sdk/mistral");
			return createMistral({
				baseURL: config.apiUrl,
				apiKey: config.apiKey,
			});
		}
		case "ollama": {
			const { createOllama } = await import("ai-sdk-ollama");
			return createOllama({
				// optional settings, e.g.
				baseURL: config.apiUrl,
			});
		}
		case "deepinfra": {
			const { createDeepInfra } = await import("@ai-sdk/deepinfra");
			return createDeepInfra({
				baseURL: config.apiUrl,
				apiKey: config.apiKey,
			});
		}
		case "gemini": {
			const { createOpenAICompatible } = await import("@ai-sdk/openai-compatible");
			return createOpenAICompatible({
				name: "gemini",
				baseURL: config.apiUrl,
				headers: {
					Authorization: `Bearer ${config.apiKey}`,
				},
			});
		}
		case "openrouter": {
			const { createOpenAICompatible } = await import("@ai-sdk/openai-compatible");
			return createOpenAICompatible({
				name: "openrouter",
				baseURL: config.apiUrl,
				headers: {
					Authorization: `Bearer ${config.apiKey}`,
				},
			});
		}
		case "zai": {
			const { createOpenAICompatible } = await import("@ai-sdk/openai-compatible");
			return createOpenAICompatible({
				name: "zai",
				baseURL: config.apiUrl,
				headers: {
					Authorization: `Bearer ${config.apiKey}`,
				},
			});
		}
		case "minimax": {
			const { createOpenAICompatible } = await import("@ai-sdk/openai-compatible");
			return createOpenAICompatible({
				name: "minimax",
				baseURL: config.apiUrl,
				headers: {
					Authorization: `Bearer ${config.apiKey}`,
				},
			});
		}
		case "custom": {
			const { createOpenAICompatible } = await import("@ai-sdk/openai-compatible");
			return createOpenAICompatible({
				name: "custom",
				baseURL: config.apiUrl,
				headers: {
					Authorization: `Bearer ${config.apiKey}`,
				},
			});
		}
		default:
			throw new Error(`Unsupported AI provider: ${providerName}`);
	}
}

export const getProviderHeaders = (
	apiUrl: string,
	apiKey: string,
): Record<string, string> => {
	// Anthropic
	if (apiUrl.includes("anthropic")) {
		return {
			"x-api-key": apiKey,
			"anthropic-version": "2023-06-01",
		};
	}

	// Mistral
	if (apiUrl.includes("mistral")) {
		return {
			Authorization: `Bearer ${apiKey}`,
		};
	}

	// Default (OpenAI style)
	return {
		Authorization: `Bearer ${apiKey}`,
	};
};
export interface Model {
	id: string;
	object: string;
	created: number;
	owned_by: string;
}
