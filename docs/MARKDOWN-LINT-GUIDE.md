# Markdown Linting Guide & Error Solutions

This document serves as the project standard for writing and maintaining clean Markdown files across Orchiné Studio documentation (`docs/`). It documents all Markdownlint warnings and errors—specifically highlighting every "Blank Lines" rule—explaining why each problem happens, demonstrating incorrect vs. correct code, and providing solutions to prevent errors from recurring.

---

## 1. Complete Guide to "Blank Lines" Rules & Error Messages

Markdown parsers (such as CommonMark, GitHub Flavored Markdown, and kramdown) rely heavily on blank lines as structural boundary delimiters between block-level elements (headings, paragraphs, lists, code fences, tables, and blockquotes). When blank lines are missing or redundant, parsers either break syntax rendering or produce unpredictable document layouts.

Below are the 6 rules governing blank lines in Markdown documents:

---

### MD032: Lists Should Be Surrounded by Blank Lines

#### Warning Message

```text
Warning: MD032/blanks-around-lists: Lists should be surrounded by blank lines
```

#### Why This Problem Occurs

A list (ordered or unordered) is placed immediately adjacent to a heading, paragraph, or another block element without an empty line separating them.

Without a blank line, Markdown engines often interpret list items as lazy continuation text of the preceding paragraph, or fail to render the list with proper margins and indentation.

#### Bad (Incorrect)

```markdown
## 1. Project Overview
- **Brand Name:** Orchiné Studio
- **Product:** Botanical Eco-Print Scarves
```

```markdown
Here are the checkout steps:
1. Select scarf design
2. Review digital receipt
```

#### Good (Correct)

```markdown
## 1. Project Overview

- **Brand Name:** Orchiné Studio
- **Product:** Botanical Eco-Print Scarves
```

```markdown
Here are the checkout steps:

1. Select scarf design
2. Review digital receipt
```

#### Solution

1. Always add **one blank line** before the first item of a list.
2. Always add **one blank line** after the last item of a list before starting any paragraph, heading, or code block.

---

### MD022: Headings Should Be Surrounded by Blank Lines

#### Warning Message

```text
Warning: MD022/blanks-around-headings: Headings should be surrounded by blank lines
```

#### Why This Problem Occurs

A Markdown heading (`#`, `##`, `###`, etc.) does not have a blank line above it and/or below it.

When headings touch surrounding text, some parsers treat following text as part of a Setext heading underline, or fail to recognize the heading entirely.

#### Bad (Incorrect)

```markdown
Welcome to the documentation.
## 2. Core User Flow
Here is the user journey.
```

#### Good (Correct)

```markdown
Welcome to the documentation.

## 2. Core User Flow

Here is the user journey.
```

#### Solution

- Always leave **one blank line above** a heading (except on line 1 of the file).
- Always leave **one blank line below** a heading before starting text, lists, tables, or code fences.

---

### MD031: Fenced Code Blocks Should Be Surrounded by Blank Lines

#### Warning Message

```text
Warning: MD031/blanks-around-fences: Fenced code blocks should be surrounded by blank lines
```

#### Why This Problem Occurs

A fenced code block (` ``` ` or ` ~~~ `) starts immediately after a line of text or heading, or content begins immediately after the closing fence without an empty line.

Markdown parsers may fail to switch into code-block mode, causing raw code or terminal output to render inline as unformatted paragraph text.

#### Bad (Incorrect)

````markdown
Run the development server:
```bash
npm run dev
```
Open your browser to test.
````

#### Good (Correct)

````markdown
Run the development server:

```bash
npm run dev
```

Open your browser to test.
````

#### Solution

- Add **one blank line** before the opening triple-backtick fence.
- Add **one blank line** after the closing triple-backtick fence.

---

### MD058: Tables Should Be Surrounded by Blank Lines

#### Warning Message

```text
Warning: MD058/blanks-around-tables: Tables should be surrounded by blank lines
```

#### Why This Problem Occurs

A markdown table (`| Col 1 | Col 2 |`) is written directly below text, headings, or lists without an intervening empty line, or text begins directly below the table.

GitHub Flavored Markdown (GFM) and CommonMark require blank lines before and after tables. Without them, tables will fail to render into HTML `<table>` elements and appear as raw text with pipe characters `|`.

#### Bad (Incorrect)

```markdown
### Scarf Inventory
| SKU | Name | Pattern |
| :--- | :--- | :--- |
| ORCH-01 | Solstice | Eucalyptus & Fern |
```

#### Good (Correct)

```markdown
### Scarf Inventory

| SKU | Name | Pattern |
| :--- | :--- | :--- |
| ORCH-01 | Solstice | Eucalyptus & Fern |

```

#### Solution

- Insert **one blank line** before the table header row.
- Insert **one blank line** after the final table row before continuing with additional content.

---

### MD012: Multiple Consecutive Blank Lines

#### Warning Message

```text
Warning: MD012/no-multiple-blanks: Multiple consecutive blank lines
```

#### Why This Problem Occurs

Two or more consecutive blank lines exist anywhere in the document (outside of fenced code blocks).

Accidental double or triple presses of the Enter key create ragged spacing, push content below the fold, and violate formatting standards.

#### Bad (Incorrect)

```markdown
## Overview



This section describes the Orchiné 3D fabric loupe.
```

#### Good (Correct)

```markdown
## Overview

This section describes the Orchiné 3D fabric loupe.
```

#### Solution

Collapse all instances of multiple empty lines down to **exactly one blank line**.

---

### MD028: Blank Line Inside Blockquote

#### Warning Message

```text
Warning: MD028/no-blanks-blockquote: Blank line inside blockquote
```

#### Why This Problem Occurs

An empty line is placed between lines of a blockquote without including the blockquote marker `>`.

A completely empty line causes the markdown engine to break the blockquote into two completely separate blockquote containers instead of one contiguous quote with paragraph breaks.

#### Bad (Incorrect)

```markdown
> "Orchiné captures the spirit of botanical printing on fine silk.

> Each scarf is an interactive exploration of sustainable craftsmanship."
```

#### Good (Correct)

```markdown
> "Orchiné captures the spirit of botanical printing on fine silk.
>
> Each scarf is an interactive exploration of sustainable craftsmanship."
```

#### Solution

Place a `>` on the blank line separating paragraphs inside a blockquote (`>\n>\n>`).

---

## 2. Heading Structure & Hierarchy Errors

### MD001: Heading Levels Should Only Increment by One Level at a Time

#### Warning Message

```text
Warning: MD001/heading-increment: Heading levels should only increment by one level at a time
```

#### Why This Problem Occurs

Skipping a heading level in the document tree (e.g., jumping from `# Title` directly to `### Sub-heading`, skipping `## Section`).

#### Bad (Incorrect)

```markdown
# Orchiné Studio

### Launch Timeline
```

#### Good (Correct)

```markdown
# Orchiné Studio

## 1. Project Overview

### Launch Timeline
```

#### Solution

Always increment heading depth by at most one level: `#` (H1) -> `##` (H2) -> `###` (H3) -> `####` (H4).

---

### MD025: Multiple Top-Level Headings in the Same Document

#### Warning Message

```text
Warning: MD025/single-title/single-h1: Multiple top-level headings in the same document
```

#### Why This Problem Occurs

Using more than one `#` (H1) tag in a single document.

#### Bad (Incorrect)

```markdown
# Orchiné Studio Scope

# Technical Architecture
```

#### Good (Correct)

```markdown
# Orchiné Studio Scope

## Technical Architecture
```

#### Solution

Reserve `#` (H1) strictly for the main document title on line 1. All subsequent headings should begin at `##` (H2).

---

### MD024: Multiple Headings with the Same Content

#### Warning Message

```text
Warning: MD024/no-duplicate-heading: Multiple headings with the same content
```

#### Why This Problem Occurs

Two or more headings in the same file have identical text, causing conflicting anchor links and navigation confusion.

#### Bad (Incorrect)

```markdown
## Section A
### Overview

## Section B
### Overview
```

#### Good (Correct)

```markdown
## Section A
### Section A Overview

## Section B
### Section B Overview
```

#### Solution

Make every heading descriptive and distinct, or configure `"MD024": { "siblings_only": true }` in `.markdownlint.json` if duplicate subheadings under different parents are required.

---

### MD036: Emphasis Used Instead of a Heading

#### Warning Message

```text
Warning: MD036/no-emphasis-as-heading: Emphasis used instead of a heading
```

#### Why This Problem Occurs

Using bold or italicized text alone on a line as a makeshift header instead of a true markdown heading.

#### Bad (Incorrect)

```markdown
**Core Deliverables**

- Scarf 3D model
- E-Commerce UI
```

#### Good (Correct)

```markdown
### Core Deliverables

- Scarf 3D model
- E-Commerce UI
```

#### Solution

Use proper Markdown header hashes (`### Core Deliverables`) rather than bold syntax (`**Core Deliverables**`).

---

### MD041: First Line in a File Should Be a Top-Level Heading

#### Warning Message

```text
Warning: MD041/first-line-heading/first-line-h1: First line in a file should be a top-level heading
```

#### Why This Problem Occurs

A Markdown file begins with an empty line, introductory text, an image, or a sub-heading instead of `# Document Title`.

#### Bad (Incorrect)

```markdown

Welcome to Orchiné Studio documentation!
```

#### Good (Correct)

```markdown
# Orchiné Studio Documentation

Welcome to Orchiné Studio documentation!
```

#### Solution

Start line 1 of every markdown file directly with a single `# Title`.

---

## 3. Code Block Errors

### MD040: Fenced Code Blocks Should Have a Language Specified

#### Warning Message

```text
Warning: MD040/fenced-code-language: Fenced code blocks should have a language specified
```

#### Why This Problem Occurs

Creating a fenced code block with bare backticks (` ``` `) without indicating the programming or data language.

#### Bad (Incorrect)

````markdown
```
const brand = "Orchiné Studio";
```
````

#### Good (Correct)

````markdown
```javascript
const brand = "Orchiné Studio";
```
````

*(Use `text` or `bash` for plain terminal output).*

#### Solution

Always write the language tag immediately after the opening backticks (e.g., `bash`, `javascript`, `typescript`, `json`, `markdown`, `css`, `text`).

---

## 4. Whitespace, Indentation & File Structure Errors

### MD047: Files Should End with a Single Newline Character

#### Warning Message

```text
Warning: MD047/single-trailing-newline: Files should end with a single newline character
```

#### Why This Problem Occurs

The file ends abruptly after characters without a trailing newline (`\n`), or ends with multiple trailing blank lines.

#### Bad (Incorrect)

```markdown
- Final list item[EOF]
```

#### Good (Correct)

```markdown
- Final list item
[EOF]
```

#### Solution

Ensure every file terminates with exactly one newline character (`\n`).

---

### MD009: No Trailing Spaces

#### Warning Message

```text
Warning: MD009/no-trailing-spaces: Trailing spaces
```

#### Why This Problem Occurs

Invisible spaces or tabs left at the very end of lines before the newline character.

#### Solution

Enable automatic whitespace trimming in your editor settings (`"files.trimTrailingWhitespace": true`).

---

### MD010: Hard Tabs

#### Warning Message

```text
Warning: MD010/no-hard-tabs: Hard tabs
```

#### Why This Problem Occurs

Tab characters (`\t`) used for indenting lists or paragraphs instead of spaces.

#### Solution

Configure your editor to insert 2 or 4 spaces when the `Tab` key is pressed.

---

### MD034: Bare URL Used

#### Warning Message

```text
Warning: MD034/no-bare-urls: Bare URL used
```

#### Why This Problem Occurs

Raw URLs pasted into markdown without wrapping them in angle brackets or link tags.

#### Bad (Incorrect)

```markdown
Check our store at https://orchinestudio.com today.
```

#### Good (Correct)

```markdown
Check our store at <https://orchinestudio.com> today.
<!-- or with anchor text: -->
Check our store at [Orchiné Studio](https://orchinestudio.com) today.
```

#### Solution

Wrap naked URLs in angle brackets `<URL>` or markdown links `[Label](URL)`.

---

## 5. Quick Reference Cheat Sheet

| Rule Code | Category | Problem Summary | Quick Solution |
| :--- | :--- | :--- | :--- |
| **MD032** | Blank Lines | List touches preceding or following text | Insert 1 blank line before and after list |
| **MD022** | Blank Lines | Heading touches text above or below | Insert 1 blank line above and below heading |
| **MD031** | Blank Lines | Code fence touches surrounding text | Insert 1 blank line above and below ` ``` ` |
| **MD058** | Blank Lines | Table touches surrounding text | Insert 1 blank line above and below table |
| **MD012** | Blank Lines | Multiple consecutive blank lines | Reduce to exactly 1 blank line |
| **MD028** | Blank Lines | Empty line inside blockquote without `>` | Add `>` to empty lines inside blockquote |
| **MD047** | Structure | Missing or extra newlines at EOF | End file with exactly one newline |
| **MD001** | Heading | Heading level skipped (e.g. H1 to H3) | Increment headings one level at a time |
| **MD025** | Heading | Multiple `#` (H1) titles in document | Use `#` only once; use `##` for sections |
| **MD024** | Heading | Duplicate heading names | Ensure heading titles are unique |
| **MD036** | Heading | Bold formatting used as heading | Use `### Heading` instead of `**Text**` |
| **MD041** | Heading | First line is not `# Title` | Put `# Title` on line 1 |
| **MD040** | Code Block | Missing code language identifier | Add language tag after ` ``` ` (e.g. ` ```bash `) |
| **MD009** | Whitespace | Trailing whitespace at end of lines | Trim trailing spaces |
| **MD010** | Whitespace | Tab character `\t` used | Replace tab with spaces |
| **MD034** | Link | Bare URL without brackets | Wrap in `<URL>` or `[Text](URL)` |

---

## 6. Automated Tooling & VS Code Configuration

To automate these rules and prevent warnings during editing, configure your workspace settings.

### Workspace Configuration (`.vscode/settings.json`)

```json
{
  "editor.formatOnSave": true,
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "files.trimFinalNewlines": true,
  "[markdown]": {
    "editor.defaultFormatter": "DavidAnson.vscode-markdownlint"
  }
}
```

### Linter Configuration (`.markdownlint.json`)

```json
{
  "default": true,
  "MD013": false,
  "MD024": {
    "siblings_only": true
  },
  "MD033": false
}
```

### Key Benefits of This Setup

1. **Automatic Blank Lines Insertion:** Saving the file automatically ensures lists, headings, tables, and code fences have required blank lines.
2. **Whitespace Trimming:** Removes trailing spaces and collapses unnecessary blank lines automatically.
3. **Clean EOF:** Every file automatically ends with exactly one newline character.
