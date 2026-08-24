console.log("Email Writer Extension - Content Section Loaded");

function createAIButton() {
    const button = document.createElement('div');

    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3 ai-reply-button';
    button.style.marginRight = '8px';
    button.style.cursor = 'pointer';
    button.innerText = 'AI Reply';

    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');

    return button;
}


function getEmailContent() {

    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]'
    ];

    for (const selector of selectors) {

        const content = document.querySelector(selector);

        if (content) {
            const text = content.innerText.trim();

            if (text) {
                return text;
            }
        }
    }

    return '';
}


function findComposeToolbar() {

    const selectors = [
        '.btC',
        '.aDh',
        '[role="toolbar"]',
        '.gU.Up'
    ];

    for (const selector of selectors) {

        const toolbar = document.querySelector(selector);

        if (toolbar) {
            return toolbar;
        }
    }

    return null;
}


function findComposeBox() {

    const selectors = [
        '[role="textbox"][g_editable="true"]',
        '[role="textbox"][contenteditable="true"]',
        'div[contenteditable="true"]'
    ];

    for (const selector of selectors) {

        const box = document.querySelector(selector);

        if (box) {
            return box;
        }
    }

    return null;
}


function injectButton() {

    // Don't create duplicate buttons
    const existingButton = document.querySelector('.ai-reply-button');

    if (existingButton) {
        return;
    }

    const toolbar = findComposeToolbar();

    if (!toolbar) {
        console.log("Toolbar not found");
        return;
    }

    console.log("Toolbar found, creating AI button");

    const button = createAIButton();

    button.addEventListener('click', async () => {

        try {

            button.innerText = 'Generating...';
            button.style.pointerEvents = 'none';

            const emailContent = getEmailContent();

            console.log("Email Content:", emailContent);

            if (!emailContent) {
                alert("Could not find the email content.");
                return;
            }


            const response = await fetch(
                'http://localhost:8080/api/email/generate',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        emailContent: emailContent,
                        tone: 'professional'
                    })
                }
            );


            if (!response.ok) {
                throw new Error('API request failed');
            }
            const generatedReply = await response.text();
            console.log("Generated Reply:", generatedReply);
            const composeBox = findComposeBox();

            if (composeBox) {

                composeBox.focus();

                document.execCommand(
                    'insertText',
                    false,
                    generatedReply
                );
                console.log("AI reply inserted");
            } else {
                console.error("Compose box was not found");
                alert("Compose box was not found.");
            }
        } catch (error) {

            console.error("AI Reply Error:", error);

            alert("Failed to generate reply.");
        } finally {

            button.innerText = 'AI Reply';
            button.style.pointerEvents = 'auto';
        }
    });
    toolbar.insertBefore(button, toolbar.firstChild);

    console.log("AI Reply button added!");

}
const observer = new MutationObserver((mutations) => {

    for (const mutation of mutations) {

        if (mutation.addedNodes.length > 0) {

            setTimeout(() => {
                injectButton();
            }, 500);
        }
    }

});
observer.observe(document.body, {
    childList: true,
    subtree: true
});