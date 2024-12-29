console.log('%c[YTthumbnail] %cScript loaded', 'color: red;', 'color: blue');

// Function to insert the thumbnail container
function addThumbnailContainer() {
    const secondaryDiv = document.querySelector("#secondary");
    if (secondaryDiv && !document.querySelector("#thumbnail-extension-container")) {
        console.log('%c[YTthumbnail] %cSecondary div found', 'color: red;', 'color: green');

        // Create a container for our extension's content
        const extensionContainer = document.createElement("div");
        extensionContainer.id = "thumbnail-extension-container";

        // Fetch the thumbnail URL from the current video
        const videoId = new URLSearchParams(window.location.search).get("v");
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

        // Add the thumbnail to the container
        const thumbnailImage = document.createElement("img");
        thumbnailImage.src = thumbnailUrl;
        thumbnailImage.alt = "Video Thumbnail";
        thumbnailImage.style.width = "100%"; // Adjust as needed
        thumbnailImage.style.border = "1px solid #ccc";

        extensionContainer.appendChild(thumbnailImage);

        // Insert the container into the YouTube page
        secondaryDiv.insertBefore(extensionContainer, secondaryDiv.firstChild);
        console.log('%c[YTthumbnail] %cThumbnail added successfully!', 'color: red;', 'color: green');
    }
}

// Observe DOM changes to dynamically detect when #secondary is available
const observer = new MutationObserver(() => {
    addThumbnailContainer();
});

// Start observing the body for changes
observer.observe(document.body, { childList: true, subtree: true });

// Run the function initially in case the element is already present
addThumbnailContainer();
