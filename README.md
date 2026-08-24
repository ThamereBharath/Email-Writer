# AI Email Writer

Writing and responding to emails can be tedious, which is why I built the AI Email Writer. This project provides two ways to generate email replies: a web application and a Chrome extension that works directly inside Gmail.

The web application allows users to paste the content of an email and generate a reply from it. The Chrome extension takes the same idea a step further by working directly inside Gmail, where it can read the current email conversation and generate a reply without requiring the user to copy and paste the content manually.

The core philosophy behind this tool is to speed up the email writing process without taking away the user's control. The generated response is provided as a draft, so the user can review, modify, and finalize it before sending.

## How the Project Works

The project consists of three main parts:

* **Web Application:** A frontend where users can paste an email and generate a reply.
* **Chrome Extension:** An extension that integrates directly with Gmail and automatically gets the email content.
* **Spring Boot Backend:** The backend that receives the email content, communicates with the AI service, and returns the generated response.

Both the web application and Chrome extension use the same backend to generate email replies.

## Web Application

The web application provides a simple interface for generating email replies without needing to install the Chrome extension.

The user can paste the content of an email into the input area and request a reply. The frontend sends the email content to the Spring Boot REST API, which processes the request and communicates with the AI service.

Once the response is generated, it is returned to the frontend and displayed on the website.

The basic flow is:

```text
Paste Email Content
        |
        v
Web Application
        |
        v
Spring Boot Backend
        |
        v
AI Service
        |
        v
Generated Reply
```

This makes the web application useful when the email content is available but the user is not using Gmail or does not want to install the extension.

## Chrome Extension

The Chrome extension provides the same email reply generation functionality, but it is integrated directly into Gmail.

Instead of manually copying the email content, the extension reads the current email conversation from Gmail when the user clicks the **AI Reply** button.

The content is then sent to the same Spring Boot backend used by the web application. After the AI generates the response, the extension receives it and inserts it directly into the Gmail reply box.

The extension workflow is:

```text
Gmail Conversation
        |
        v
AI Reply Button
        |
        v
Email Content
        |
        v
Spring Boot Backend
        |
        v
AI Service
        |
        v
Generated Reply
        |
        v
Gmail Reply Box
```

The main difference between the two interfaces is how the email content is provided.

| Web Application                               | Chrome Extension                       |
| --------------------------------------------- | -------------------------------------- |
| User pastes the email content                 | Email content is read from Gmail       |
| Works as a standalone website                 | Works directly inside Gmail            |
| User views the generated reply on the website | Generated reply is inserted into Gmail |
| No browser extension required                 | Requires the Chrome extension          |

## Under the Hood: How It Works

The system is split into a web application frontend, a Chrome extension, and a Spring Boot backend.

Both the website and extension send email content to the same REST API. The backend acts as the middleman between the frontend clients and the AI service.

This keeps the AI-related logic on the backend while allowing both interfaces to use the same email generation functionality.

## The Tech Stack

### Web Application

* HTML
* CSS
* JavaScript

### Chrome Extension

* HTML
* CSS
* JavaScript
* Chrome Extension APIs

### Backend

* Java
* Spring Boot
* Spring Web
* REST APIs

### AI Integration

* AI API for generating email responses

### Development Tools

* Git
* GitHub
* Maven
* Postman
* IntelliJ IDEA
* VS Code
* Google Chrome

## Project Structure

The project contains the web application, Chrome extension, and Spring Boot backend.

```text
Email-Writer/
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   ├── pom.xml
│   └── ...
│
├── extension/
│   ├── manifest.json
│   ├── content.js
│   ├── content.css
│   └── ...
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── ...
│
├── .gitignore
└── README.md
```

The exact folder structure may be slightly different depending on the current version of the project.

## Getting Started

To run the project locally, you will need Java, Maven, Git, and Google Chrome installed on your machine.

You will also need a valid API key from the AI provider used by the backend.

### Step 1: Clone the Repository

Clone the repository to your local machine:

```bash
git clone <YOUR_REPOSITORY_URL>
```

Move into the project directory:

```bash
cd Email-Writer
```

## Step 2: Set Up the Backend

Navigate to the backend folder:

```bash
cd backend
```

Start the Spring Boot application using Maven:

```bash
mvn spring-boot:run
```

If everything is configured correctly, the backend should start on:

```text
http://localhost:8080
```

The port may be different if it has been changed in the Spring Boot configuration.

Keep the backend running while using either the web application or the Chrome extension.

## Step 3: Configure the API Key

The backend needs an API key to communicate with the AI service.

The API key should not be hardcoded directly into the source code or committed to GitHub.

Depending on the backend configuration, you can provide the key through an environment variable or a local configuration file.

For example:

```text
AI_API_KEY=your_api_key_here
```

Use the configuration method required by the backend implementation.

Make sure that any local configuration file containing sensitive information is added to `.gitignore`.

## Step 4: Run the Web Application

Open the frontend folder and run it using the method required by the project.

If the frontend consists of static HTML, CSS, and JavaScript files, you can open the main HTML file directly in a browser or use a local development server.

For example, if you are using VS Code, the Live Server extension can be used to run the frontend locally.

Once the website is running, enter or paste the content of an email into the provided input area and generate a reply.

The generated response will be displayed on the website.

## Step 5: Load the Chrome Extension

The Chrome extension can be loaded locally using Chrome's Developer mode.

Open Google Chrome and go to:

```text
chrome://extensions/
```

Turn on **Developer mode** from the top-right corner.

Click **Load unpacked** and select the folder containing the extension's `manifest.json` file.

The extension should now appear in your list of installed extensions.

After installing the extension, open Gmail and refresh the page.

## Step 6: Use the Chrome Extension

Open an email conversation in Gmail.

The extension adds an **AI Reply** button to the Gmail interface.

Clicking the button starts the reply generation process.

The extension will:

1. Read the current email conversation.
2. Extract the relevant email content.
3. Send the content to the Spring Boot backend.
4. The backend sends the content to the AI service.
5. The generated response is returned to the extension.
6. The extension inserts the response into the Gmail reply box.

The generated response can then be reviewed and edited before sending.

## API Flow

Both the web application and Chrome extension communicate with the same backend API.

```text
                  +-------------------+
                  |   Web Application |
                  +---------+---------+
                            |
                            |
                            v
                  +-------------------+
                  |   Spring Boot API |
                  +---------+---------+
                            |
                            v
                  +-------------------+
                  |    AI Service     |
                  +---------+---------+
                            |
                            v
                  +-------------------+
                  | Generated Response|
                  +-------------------+


                  +-------------------+
                  |  Gmail Extension  |
                  +---------+---------+
                            |
                            |
                            +----------> Spring Boot API
```

The backend provides a common layer for both clients, so the email generation logic does not have to be duplicated between the website and extension.

## Testing the Backend

The backend API can be tested separately using Postman.

This is useful for checking whether the backend and AI service are working correctly before testing the Chrome extension.

A typical request follows this flow:

```text
Email Content
     |
     v
REST API
     |
     v
AI Service
     |
     v
Generated Reply
```

If the API works correctly in Postman but not in the extension, the issue is likely related to the extension or Gmail integration.

## Troubleshooting

### AI Reply Button Is Not Showing

Try the following:

* Refresh Gmail.
* Reload the extension from `chrome://extensions/`.
* Make sure the extension is enabled.
* Check the browser Developer Console for JavaScript errors.
* Make sure the extension was loaded from the correct folder.

### The Web Application Is Not Generating a Reply

Check whether the Spring Boot backend is running.

Also verify:

* The backend URL used by the frontend.
* The API endpoint.
* The API key.
* Any CORS configuration.
* Errors shown in the browser console.
* Errors shown in the Spring Boot console.

### The Extension Cannot Connect to the Backend

Make sure the backend is running and that the URL configured in the extension points to the correct backend address.

For a typical local setup:

```text
http://localhost:8080
```

Also check the browser console and Spring Boot console for connection or CORS errors.

### The Generated Reply Is Not Inserted Into Gmail

The extension interacts with Gmail's DOM to find the email content and reply box.

Gmail can change its interface from time to time, which may cause existing DOM selectors to stop working.

If this happens, inspect the relevant Gmail elements using Chrome Developer Tools and update the selectors used by the extension.

## Security

API keys, passwords, access tokens, and other sensitive information should never be committed to GitHub.

Before pushing the project, make sure that sensitive files are included in `.gitignore`.

For example:

```gitignore
.env
application-local.properties
```

Never add an actual API key to the README or source code.

If an API key is accidentally pushed to a public repository, revoke the key and generate a new one immediately.

## Future Improvements

There are several improvements that can be added as the project evolves:

* Add different reply styles such as professional, friendly, or casual.
* Give users more control over the length and tone of generated replies.
* Improve handling of longer email conversations.
* Add support for multiple languages.
* Improve error handling and loading states.
* Make the extension UI more customizable.
* Add better configuration options for the AI service.
* Improve the way email content is extracted from Gmail.
* Add authentication and user-specific settings.

## Project Status

The project is currently under development.

The main functionality of generating email replies through the web application and Chrome extension is implemented. The web application allows users to manually provide email content, while the Chrome extension integrates the same functionality directly into Gmail.

Further improvements will focus on making the generated responses more flexible and improving the overall user experience.

## Author

**Bharath**
