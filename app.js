(function () {
    "use strict";

    const STORAGE_KEY = "cs50w-wiki-demo:v1";

    const app = document.getElementById("app");
    const libraryError = document.getElementById("library-error");
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");

    let entries = {};

    const ESCAPES = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    };

    const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ESCAPES[character]);

    const entryLink = (title) => `#/wiki/${encodeURIComponent(title)}`;

    const navigate = (hash) => {
        location.hash = hash;
    };

    const decodeTitle = (title) => {
        try {
            return decodeURIComponent(title);
        } catch (error) {
            return title;
        }
    };

    const listEntries = () => Object.keys(entries).sort();

    const getEntry = (title) => (
        Object.prototype.hasOwnProperty.call(entries, title) ? entries[title] : null
    );

    function showError(message) {
        libraryError.innerHTML = `<div class="alert alert-danger" role="alert">${message}</div>`;
    }

    function persist() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
        } catch (error) {
            showError("Could not save changes: this browser blocks or has filled up its localStorage.");
        }
    }

    function saveEntry(title, content) {
        entries[title] = content;
        persist();
    }

    function readSavedEntries() {
        let saved = null;
        try {
            saved = localStorage.getItem(STORAGE_KEY);
        } catch (error) {
            return null;
        }
        if (!saved) {
            return null;
        }
        try {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
                return parsed;
            }
        } catch (error) {
            return null;
        }
        return null;
    }

    async function loadEntries() {
        const saved = readSavedEntries();
        if (saved) {
            entries = saved;
            return;
        }
        try {
            const response = await fetch("entries.json");
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`);
            }
            entries = await response.json();
            persist();
        } catch (error) {
            entries = {};
            showError(`Could not load <code>entries.json</code> (${escapeHTML(error.message)}). If you opened <code>index.html</code> directly, serve this folder over HTTP instead, as explained in <code>demo/README.md</code>.`);
        }
    }

    async function resetDemo() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            showError("Could not clear this browser's localStorage.");
        }
        await loadEntries();
        if (location.hash === "" || location.hash === "#/") {
            renderRoute();
        } else {
            navigate("#/");
        }
    }

    function renderMarkdown(source) {
        if (typeof marked === "undefined" || typeof DOMPurify === "undefined") {
            showError("The Markdown libraries (marked and DOMPurify) could not be loaded from the CDN. Check your internet connection and reload the page.");
            return "";
        }
        const withHashLinks = source.replace(/\]\(\/wiki\/([^)]+)\)/g, "](#/wiki/$1)");
        return DOMPurify.sanitize(marked.parse(withHashLinks));
    }

    function entryList(titles) {
        const items = titles.map((title) => (
            `<a href="${entryLink(title)}" class="list-group-item list-group-item-action">${escapeHTML(title)}</a>`
        )).join("\n");
        return `<div class="list-group">\n${items}\n</div>`;
    }

    function viewIndex() {
        return {
            title: "Encyclopedia",
            html: `<h2>All Pages</h2>
${entryList(listEntries())}`
        };
    }

    function viewEntry({ param: title }) {
        const name = decodeTitle(title);
        const content = getEntry(name);
        if (content === null) {
            return viewNotFound();
        }
        return {
            title: `Encyclopedia - ${name}`,
            html: `<a class="btn btn-outline-primary" href="#/edit/${encodeURIComponent(name)}" role="button">Edit</a>
<div class="entry-content">
    ${renderMarkdown(content)}
</div>`
        };
    }

    function viewSearch({ query }) {
        const searched = query.get("q") || "";
        const titles = listEntries();

        for (const title of titles) {
            if (searched === title) {
                navigate(entryLink(title));
                return null;
            }
        }

        const matching = titles.filter((title) => title.includes(searched));
        if (matching.length > 0) {
            return {
                title: "Encyclopedia",
                html: `<h2>Matching Results</h2>
${entryList(matching)}`
            };
        }

        return {
            title: "Encyclopedia",
            html: `<div class="alert alert-danger" role="alert">No results found for "${escapeHTML(searched)}"</div>
<h2>See All Pages</h2>
${entryList(titles)}`
        };
    }

    function viewNew() {
        return {
            title: "Encyclopedia - Add New Entry",
            html: `<div id="form-error"></div>
<h2>Add New Entry</h2>
<form id="add-form">
    <div class="mb-3">
        <label for="entry_title" class="form-label">Entry Title:</label>
        <input type="text" class="form-control" id="entry_title" name="title">
    </div>
    <div class="mb-3">
        <label for="entry_content" class="form-label">Entry Content:</label>
        <textarea class="form-control" id="entry_content" name="content" placeholder="Write your Markdown content here..."></textarea>
    </div>
    <button type="submit" class="btn btn-primary">Save Entry</button>
</form>`
        };
    }

    function viewEdit({ param: title }) {
        const name = decodeTitle(title);
        const content = getEntry(name);
        if (content === null) {
            return viewNotFound();
        }
        return {
            title: `Encyclopedia - Edit ${name}`,
            html: `<div id="form-error"></div>
<h2>Edit ${escapeHTML(name)}</h2>
<form id="edit-form" data-title="${escapeHTML(name)}">
    <div class="mb-3">
        <label for="entry_content" class="form-label">Entry Content:</label>
        <textarea class="form-control" id="entry_content" name="content">${escapeHTML(content)}</textarea>
    </div>
    <button type="submit" class="btn btn-primary">Save Entry</button>
</form>`
        };
    }

    function viewRandom() {
        const titles = listEntries();
        if (titles.length === 0) {
            return viewNotFound();
        }
        navigate(entryLink(titles[Math.floor(Math.random() * titles.length)]));
        return null;
    }

    function viewNotFound() {
        return {
            title: "Encyclopedia - Page Not Found",
            html: `<div class="d-flex flex-column align-items-center justify-content-center text-center" style="min-height: 65vh;">
<h1 class="display-1 fw-light text-secondary opacity-25 mb-2">404</h1>
<p class="fs-4 fw-light text-body-secondary mb-4">The page you looking for isn't available </p>
<a href="#/" class="btn btn-outline-primary px-4 py-2">Back to Wiki</a>
</div>`
        };
    }

    const routes = [
        { pattern: /^\/?$/, view: viewIndex },
        { pattern: /^\/wiki\/(.*)$/, view: viewEntry },
        { pattern: /^\/new\/?$/, view: viewNew },
        { pattern: /^\/edit\/(.*)$/, view: viewEdit },
        { pattern: /^\/random\/?$/, view: viewRandom },
        { pattern: /^\/search\/?$/, view: viewSearch }
    ];

    function renderPage(page) {
        document.title = page.title;
        app.innerHTML = page.html;
        searchInput.value = "";
    }


    function renderRoute() {
        const hash = location.hash.replace(/^#/, "") || "/";
        const separator = hash.indexOf("?");
        const path = separator === -1 ? hash : hash.slice(0, separator);
        const query = new URLSearchParams(separator === -1 ? "" : hash.slice(separator + 1));

        for (const route of routes) {
            const match = path.match(route.pattern);
            if (!match) {
                continue;
            }
            const page = route.view({ param: match[1] === undefined ? null : match[1], query });
            if (page) {
                renderPage(page);
            }
            return;
        }
        renderPage(viewNotFound());
    }

    function showFormError(message) {
        const box = document.getElementById("form-error");
        if (box) {
            box.innerHTML = `<h2>${escapeHTML(message)}</h2>`;
        }
    }

    function submitNew() {
        const title = document.getElementById("entry_title").value.trim();
        const content = document.getElementById("entry_content").value;

        if (title === "") {
            showFormError("Please provide a title");
            return;
        }
        if (getEntry(title) !== null) {
            showFormError("This title already exist");
            return;
        }
        saveEntry(title, content);
        navigate(entryLink(title));
    }

    function submitEdit(name) {
        const content = document.getElementById("entry_content").value;
        saveEntry(name, content);
        navigate(entryLink(name));
    }

    app.addEventListener("submit", (event) => {
        const form = event.target;
        if (form.id === "add-form") {
            event.preventDefault();
            submitNew();
        } else if (form.id === "edit-form") {
            event.preventDefault();
            submitEdit(form.dataset.title);
        }
    });

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        navigate(`#/search?q=${encodeURIComponent(searchInput.value)}`);
    });

    document.getElementById("reset-demo").addEventListener("click", (event) => {
        event.preventDefault();
        const confirmed = confirm("Reset the demo? Entries created or edited in this browser will be replaced with the original sample data.");
        if (confirmed) {
            resetDemo();
        }
    });

    async function init() {
        await loadEntries();
        window.addEventListener("hashchange", renderRoute);
        if (location.hash === "") {
            navigate("#/");
        }
        renderRoute();
    }

    init();
})();
