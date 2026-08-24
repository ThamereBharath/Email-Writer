package com.example.writer.service;

import com.example.writer.dto.EmailRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.Map;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;
    private final ObjectMapper mapper = new ObjectMapper();

    public EmailGeneratorService() {
        this.webClient = WebClient.create();
    }

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public String generateEmailReply(EmailRequest emailRequest) {

        long start = System.currentTimeMillis();

        String prompt = buildPrompt(emailRequest);

        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", prompt)
                        })
                }
        );

        System.out.println("Sending request to Gemini...");

        try {

            long apiStart = System.currentTimeMillis();

            String response = webClient.post()
                    .uri(geminiApiUrl.trim() + "?key=" + geminiApiKey.trim())
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            long apiEnd = System.currentTimeMillis();

            System.out.println(
                    "Gemini response received in: "
                            + (apiEnd - apiStart)
                            + " ms"
            );

            String result = extractResponseContent(response);

            long end = System.currentTimeMillis();

            System.out.println(
                    "Total generateEmailReply time: "
                            + (end - start)
                            + " ms"
            );

            return result;

        } catch (WebClientResponseException e) {

            System.out.println(
                    "Gemini API Error: "
                            + e.getStatusCode()
            );

            System.out.println(
                    "Response: "
                            + e.getResponseBodyAsString()
            );

            throw new RuntimeException(
                    "Gemini API request failed. Please try again later."
            );

        } catch (Exception e) {

            e.printStackTrace();

            throw new RuntimeException(
                    "Unable to generate email reply. Please try again."
            );
        }
    }

    private String extractResponseContent(String response) {

        try {

            JsonNode rootNode = mapper.readTree(response);

            JsonNode candidates = rootNode.path("candidates");

            if (!candidates.isArray() || candidates.isEmpty()) {
                throw new RuntimeException(
                        "Gemini returned an invalid response."
                );
            }

            JsonNode textNode = candidates
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");

            if (textNode.isMissingNode() || textNode.asText().isBlank()) {
                throw new RuntimeException(
                        "Gemini returned an empty response."
                );
            }

            return textNode.asText();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to process Gemini response."
            );
        }
    }

    private String buildPrompt(EmailRequest emailRequest) {

        String tone = emailRequest.getTone();

        if (tone == null || tone.isBlank()) {
            tone = "professional";
        }

        return """
                Write a short email reply.
                Tone: %s.
                Do not include a subject line.
                Return only the complete reply.

                Original email:
                %s
                """.formatted(
                tone,
                emailRequest.getEmailContent()
        );
    }
}
