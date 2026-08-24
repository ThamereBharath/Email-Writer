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
            System.out.println("Gemini API Error: " + e.getResponseBodyAsString());

            return "Google API Error (" + e.getStatusCode() + "): "
                    + e.getResponseBodyAsString();

        } catch (Exception e) {
            e.printStackTrace();
            return "Application Error: " + e.getMessage();
        }
    }

    private String extractResponseContent(String response) {
        try {
            JsonNode rootNode = mapper.readTree(response);

            return rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

        } catch (Exception e) {
            return "Error parsing response: " + e.getMessage();
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