## Radix UI Cheatsheet

### 1. Getting Started & Core Setup

#### Installation
```bash
npm install @radix-ui/themes @radix-ui/react-icons
```

#### Root Layout Setup (e.g., `layout.tsx` in Next.js)
```jsx
// 1. Import CSS at the root of your app
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* 2. Wrap your app in the <Theme> component */}
        <Theme>
          {children}
        </Theme>
      </body>
    </html>
  );
}
```

### 2. Core Concepts

#### The `<Theme>` Component
This is the heart of your application's styling.

**Key Props:**
*   `accentColor`: Changes the primary color for interactive elements (e.g., `"indigo"`, `"crimson"`, `"grass"`).
*   `grayColor`: Sets the hue for neutral elements (e.g., `"slate"`, `"sand"`, `"gray"`).
*   `appearance`: Forces a theme (`"light"` or `"dark"`). Best used with a library like `next-themes` for system preference.
*   `radius`: Controls the border-radius of components (`"none"`, `"small"`, `"medium"`, `"large"`, `"full"`).
*   `scaling`: Adjusts the UI density (`"90%"`, `"100%"`, `"110%"`).
*   `panelBackground`: Sets the background for panels like cards and dialogs (`"solid"`, `"translucent"`).
*   `hasBackground`: `boolean` - Set to `false` if the theme shouldn't render a background color.

#### Component Anatomy
Components are composed of parts, accessed with dot notation.
```jsx
import { Dialog } from '@radix-ui/themes';

<Dialog.Root>
  <Dialog.Trigger>
    <Button>Open</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>Title</Dialog.Title>
    <Dialog.Description>Description</Dialog.Description>
    <Dialog.Close>
      <Button>Close</Button>
    </Dialog.Close>
  </Dialog.Content>
</Dialog.Root>
```

#### Responsive Props
Most layout and size props accept a responsive object.
```jsx
<Grid columns={{ initial: '1', sm: '2', md: '3' }} />
<Box p={{ initial: '2', md: '5' }} />
```

### 3. Layout Components

These are the fundamental building blocks for creating any UI structure.

| Component | Description | Key Props & Example |
| :--- | :--- | :--- |
| **`Box`** | The most basic layout block, like a `div`. | `p`, `m`, `width`, `height`, `position`<br/>`<Box p="4" width="100%">...</Box>` |
| **`Flex`** | A `div` with `display: flex`. | `direction`, `align`, `justify`, `gap`, `wrap`<br/>`<Flex align="center" justify="between" gap="3">...</Flex>` |
| **`Grid`** | A `div` with `display: grid`. | `columns`, `rows`, `gap`, `flow`<br/>`<Grid columns="3" gap="3">...</Grid>` |
| **`Container`** | Constrains content to a max-width. | `size`: `"1"` to `"4"`<br/>`<Container size="2">...</Container>` |
| **`Section`** | Adds consistent vertical padding. | `size`: `"1"` to `"3"`<br/>`<Section size="2">...</Section>` |

#### Common Layout & Margin Props
Available on most components. Values `"1"`-`"9"` map to the space scale.
*   `m`, `mx`, `my`, `mt`, `mr`, `mb`, `ml` (Margin)
*   `p`, `px`, `py`, `pt`, `pr`, `pb`, `pl` (Padding)

### 4. Common Components Showcase

#### `Button` & `IconButton`
*   **Description**: Triggers actions. `IconButton` is optimized for a single icon.
*   **Key Props**:
    *   `variant`: `"classic"`, `"solid"`, `"soft"`, `"surface"`, `"outline"`, `"ghost"`
    *   `size`: `"1"` to `"4"`
    *   `color`: Any theme color (e.g., `"indigo"`, `"red"`)
    *   `radius`: `"none"`, `"large"`, `"full"`
    *   `loading`: `boolean` - Shows a spinner.
*   **Usage**: `<Button size="2" variant="soft"><PlusIcon/> Add</Button>`

#### `Card`
*   **Description**: A container for related content.
*   **Key Props**:
    *   `size`: `"1"` to `"5"`
    *   `variant`: `"surface"`, `"classic"`
    *   `asChild`: Use to make the card a link or button.
*   **Usage**: `<Card asChild><a href="#">...</a></Card>`

#### `Badge`
*   **Description**: A small label for status, counts, etc.
*   **Key Props**:
    *   `variant`: `"solid"`, `"soft"`, `"surface"`, `"outline"`
    *   `size`: `"1"` to `"3"`
    *   `color`, `radius`, `highContrast`
*   **Usage**: `<Badge color="green">Complete</Badge>`

#### `Table`
*   **Description**: For displaying tabular data.
*   **Key Props**:
    *   `variant`: `"surface"` (adds a background), `"ghost"` (default)
    *   `size`: `"1"` to `"3"`
*   **Anatomy**: `<Table.Root>`, `<Table.Header>`, `<Table.Body>`, `<Table.Row>`, `<Table.ColumnHeaderCell>`, `<Table.RowHeaderCell>`, `<Table.Cell>`

#### `Callout`
*   **Description**: An alert-like message to attract attention.
*   **Key Props**:
    *   `variant`: `"soft"`, `"surface"`, `"outline"`
    *   `size`, `color`, `highContrast`
*   **Anatomy**: `<Callout.Root>`, `<Callout.Icon>`, `<Callout.Text>`
*   **Usage**: `<Callout.Root color="red"><Callout.Icon><ExclamationTriangleIcon/></Callout.Icon>...</Callout.Root>`

### 5. Form Components

#### `TextField`
*   **Description**: A single-line text input with optional slots.
*   **Key Props**: `size`, `variant`, `color`, `radius`, `placeholder`.
*   **Anatomy**: `<TextField.Root>`, `<TextField.Slot>`
*   **Usage**:
    ```jsx
    <TextField.Root placeholder="Search...">
      <TextField.Slot>
        <MagnifyingGlassIcon />
      </TextField.Slot>
    </TextField.Root>
    ```

#### `TextArea`
*   **Description**: A multi-line text input.
*   **Key Props**: `size`, `variant`, `color`, `radius`, `resize` (`"none"`, `"vertical"`, etc).
*   **Usage**: `<TextArea placeholder="Your comment..."/>`

#### `Select`
*   **Description**: A dropdown for selecting an option.
*   **Key Props**: `size`, `variant`, `color`, `radius`, `placeholder`, `defaultValue`.
*   **Anatomy**: `<Select.Root>`, `<Select.Trigger>`, `<Select.Content>`, `<Select.Item>`, `<Select.Group>`, `<Select.Label>`, `<Select.Separator>`
*   **Usage**:
    ```jsx
    <Select.Root defaultValue="apple">
      <Select.Trigger placeholder="Pick a fruit..." />
      <Select.Content>
        <Select.Item value="apple">Apple</Select.Item>
      </Select.Content>
    </Select.Root>
    ```

#### `Checkbox` & `RadioGroup`
*   **Description**: For toggling options. `RadioGroup` ensures only one choice.
*   **Key Props**: `size`, `variant`, `color`, `highContrast`.
*   **Anatomy**: `RadioGroup.Root`, `RadioGroup.Item`.
*   **Usage**: `<Checkbox defaultChecked /> Agree to terms`

#### `Switch` & `Slider`
*   **Description**: `Switch` is a toggle. `Slider` selects from a range.
*   **Key Props**: `size`, `variant`, `color`, `radius`, `highContrast`.
*   **Usage**: `<Switch defaultChecked />` | `<Slider defaultValue={[50]} />`

### 6. Overlays & Menus

#### `Dialog` & `AlertDialog`
*   **Description**: Modal windows. `AlertDialog` is for confirmation and interrupts the user.
*   **Anatomy**: `.Root`, `.Trigger`, `.Content`, `.Title`, `.Description`, `.Close`. `AlertDialog` also has `.Action` and `.Cancel`.
*   **Key Prop (`Content`)**: `size`, `maxWidth`.

#### `Popover` & `HoverCard`
*   **Description**: Floating elements for displaying rich content. `Popover` is on-click, `HoverCard` is on-hover.
*   **Anatomy**: `.Root`, `.Trigger`, `.Content`.
*   **Key Prop (`Content`)**: `size`, `width`, `maxWidth`.

#### `DropdownMenu` & `ContextMenu`
*   **Description**: Menus with a set of actions. `DropdownMenu` is triggered by a button, `ContextMenu` by a right-click.
*   **Anatomy**: `.Root`, `.Trigger`, `.Content`, `.Item`, `.CheckboxItem`, `.RadioGroup`, `.RadioItem`, `.Sub`, `.SubTrigger`, `.SubContent`, `.Separator`.
*   **Key Prop (`Content`)**: `size`, `variant`, `color`.

#### `Tooltip`
*   **Description**: Provides contextual information on hover or focus.
*   **Usage**: `<Tooltip content="Add to library"><IconButton>...</IconButton></Tooltip>`

### 7. Radix Primitives & `asChild`

*   **Radix Primitives**: The unstyled, accessible components that power Radix Themes. Use them when you need full control over styling. Install them individually (e.g., `npm install @radix-ui/react-dialog`).
*   **`asChild` Prop**: The most powerful composition feature. It merges the props and behavior of a Radix component onto its immediate child, instead of rendering its own DOM element. This is essential for using custom components or third-party links (like `next/link`) with Radix triggers.

    ```jsx
    import NextLink from 'next/link';
    import { Link } from '@radix-ui/themes';

    // The Radix <Link> component's behavior is applied to the Next.js <Link>.
    <Link asChild>
      <NextLink href="/about">About Us</NextLink>
    </Link>
    ```

## Radix UI Components Cheatsheet

### Core Concepts & Setup

| Concept | Description |
| :--- | :--- |
| **`<Theme>`** | (Themes) The root component that provides theme configuration (`accentColor`, `radius`, `scaling`, etc.) to all descendants. Wrap your entire app in it. |
| **`asChild` Prop** | (Primitives & Themes) The most powerful prop. Merges the component's functionality onto its direct child, allowing you to use your own components (like `next/link`) or change the underlying HTML tag. |
| **Anatomy** | Components are composed of parts, accessed with dot notation (e.g., `Dialog.Root`, `Dialog.Trigger`). |
| **Responsive Props** | (Themes) Most layout/size props accept a responsive object: `size={{ initial: '1', md: '3' }}`. |

---

### Layout Components

| Component | Description | Key Info / Anatomy | Quick Example (Themes) |
| :--- | :--- | :--- | :--- |
| **Box** | The fundamental `div` block for layout and spacing. | **Props**: `p`, `m`, `width`, `height`, `position` | `<Box p="4">Content</Box>` |
| **Flex** | A `div` with `display: flex`. | **Props**: `direction`, `align`, `justify`, `gap` | `<Flex align="center" gap="3">...</Flex>` |
| **Grid** | A `div` with `display: grid`. | **Props**: `columns`, `rows`, `gap` | `<Grid columns="3" gap="3">...</Grid>` |
| **Container**| Constrains content width for readability. | **Props**: `size` (`"1"`-`"4"`) | `<Container size="2">...</Container>` |
| **Section** | Adds consistent vertical spacing between large page areas. | **Props**: `size` (`"1"`-`"4"`) | `<Section size="3">...</Section>` |
| **Separator**| A visual or semantic dividing line. | **Props**: `orientation`, `size` (Themes) | `<Separator orientation="vertical" />`|
| **AspectRatio**| Constrains its content to a specific ratio. | **Props**: `ratio` (e.g., `16 / 9`) | `<AspectRatio ratio={16/9}>...</AspectRatio>` |

---

### Typography & Text

| Component | Description | Key Props (Themes) | Quick Example (Themes) |
| :--- | :--- | :--- | :--- |
| **Heading** | A semantic heading (`<h1>`-`<h6>`). | `as`, `size`, `weight`, `color`, `trim`, `truncate` | `<Heading as="h2" size="5">Title</Heading>`|
| **Text** | The base component for all text content. | `as`, `size`, `weight`, `color`, `trim`, `truncate` | `<Text as="p" size="3">Body text.</Text>`|
| **Link** | A semantic navigation link (`<a>`). | `size`, `weight`, `color`, `underline` | `<Link href="#">Click me</Link>` |
| **Blockquote**| For quoting a block of text from another source. | `size`, `weight`, `color` | `<Blockquote>Wise words...</Blockquote>` |
| **Code** | For short fragments of computer code. | `variant`, `size`, `weight`, `color` | `<Code>const a = 1;</Code>` |
| **Em** | Stress emphasis, typically rendered as italics. | (Inherits from `Text`) | `This is <Em>important</Em>.` |
| **Strong** | Strong importance, typically rendered as bold. | (Inherits from `Text`) | `This is <Strong>very</Strong> important.` |
| **Quote** | For short, inline quotations. | (Inherits from `Text`) | `He said, <Quote>Hi!</Quote>` |
| **Kbd** | Represents keyboard input. | `size` | `<Kbd>Shift + K</Kbd>` |

---

### Form Controls

| Component | Description | Anatomy / Key Props | Quick Example (Themes) |
| :--- | :--- | :--- | :--- |
| **Button** | A standard button to trigger an action. | `variant`, `size`, `color`, `radius`, `loading` | `<Button variant="soft">Submit</Button>` |
| **IconButton**| A square button for a single icon. | `variant`, `size`, `color`, `radius`, `loading` | `<IconButton><PlusIcon /></IconButton>`|
| **TextField** | A single-line text input with optional slots. | **Anatomy**: `Root`, `Slot`<br/>**Props**: `size`, `variant`, `color`, `radius` | `<TextField.Root><TextField.Slot>@</TextField.Slot></TextField.Root>` |
| **TextArea**| A multi-line text input. | **Props**: `size`, `variant`, `color`, `radius`, `resize` | `<TextArea placeholder="Comment..." />` |
| **Select** | A dropdown for selecting an option. | **Anatomy**: `Root`, `Trigger`, `Content`, `Item`<br/>**Props**: `size`, `variant`, `color`, `radius` | `<Select.Root><Select.Trigger/><Select.Content>...</Select.Content></Select.Root>`|
| **Checkbox**| An on/off toggle. | **Props**: `size`, `variant`, `color`, `highContrast` | `<Checkbox defaultChecked />` |
| **RadioGroup**| A set of options where only one can be selected. | **Anatomy**: `Root`, `Item`<br/>**Props**: `size`, `variant`, `color` | `<RadioGroup.Root><RadioGroup.Item value="1"/>...</RadioGroup.Root>`|
| **Switch** | A toggle switch. | **Props**: `size`, `variant`, `color`, `radius` | `<Switch defaultChecked />` |
| **Slider** | Select a value from a range. | **Props**: `size`, `variant`, `color`, `radius` | `<Slider defaultValue={[25, 75]} />` |
| **CheckboxCards**| Interactive cards for multi-selection. | **Anatomy**: `Root`, `Item`<br/>**Props**: `columns`, `size`, `variant`, `color` | `<CheckboxCards.Root><CheckboxCards.Item value="1">...</CheckboxCards.Root>`|
| **RadioCards**| Interactive cards for single selection. | **Anatomy**: `Root`, `Item`<br/>**Props**: `columns`, `size`, `variant`, `color` | `<RadioCards.Root><RadioCards.Item value="1">...</RadioCards.Root>`|
| **Segmented­Control**| A group of buttons for switching views (styled `ToggleGroup`). | **Anatomy**: `Root`, `Item`<br/>**Props**: `size`, `variant`, `radius` | `<SegmentedControl.Root>...</SegmentedControl.Root>`|
| **Label** (Primitive) | An accessible label for form controls. | `htmlFor` | `<Label.Root htmlFor="name">Name</Label.Root>`|
| **Form** (Primitive)| Handles form state and validation. | **Anatomy**: `Root`, `Field`, `Label`, `Control`, `Message`, `Submit`| `<Form.Root><Form.Field name="email">...</Form.Root>` |

---

### Overlays, Menus & Popups

| Component | Description | Anatomy | Key Props (Content) |
| :--- | :--- | :--- | :--- |
| **Dialog** | A modal window that renders content inert. | `Root`, `Trigger`, `Content`, `Title`, `Description`, `Close` | `size`, `maxWidth` |
| **AlertDialog** | A modal that interrupts and expects a response. | `...`, `Action`, `Cancel` | `size`, `maxWidth` |
| **Popover** | A floating element triggered by a button click. | `Root`, `Trigger`, `Content`, `Close` | `size`, `width` |
| **HoverCard** | A floating element triggered by hover. | `Root`, `Trigger`, `Content` | `size`, `width` |
| **DropdownMenu** | A menu of actions triggered by a button. | `Root`, `Trigger`, `Content`, `Item`, `Sub`, `Separator`, etc. | `size`, `variant`, `color` |
| **ContextMenu**| A menu of actions triggered by a right-click. | `Root`, `Trigger`, `Content`, `Item`, `Sub`, `Separator`, etc. | `size`, `variant`, `color` |
| **Tooltip** | Displays information on hover or focus. | (Themes simplifies to one component) | `content` |

---

### Data Display & Status

| Component | Description | Anatomy / Key Props | Quick Example (Themes) |
| :--- | :--- | :--- | :--- |
| **Card** | A container that groups related content. | `size`, `variant`, `asChild` | `<Card>Content</Card>` |
| **Avatar** | A user profile picture or initials. | `size`, `variant`, `color`, `radius`, `fallback`, `src`| `<Avatar src="..." fallback="A" />` |
| **Badge** | Small label for status or counts. | `variant`, `size`, `color`, `radius` | `<Badge color="blue">In Review</Badge>` |
| **Table** | Displays data in rows and columns. | `Root`, `Header`, `Body`, `Row`, `Cell`... | `<Table.Root>...</Table.Root>` |
| **DataList** | Displays key-value pairs. | `Root`, `Item`, `Label`, `Value` | `<DataList.Root>...</DataList.Root>` |
| **Progress** | A bar showing task completion progress. | `value`, `size`, `variant`, `color` | `<Progress value={60} />` |
| **Spinner** | An animated loading indicator. | `size`, `loading` | `<Spinner size="3" />` |
| **Skeleton** | A placeholder that mimics content shape while loading. | `loading`, `width`, `height` | `<Skeleton loading={isLoading}><Avatar ... /></Skeleton>` |

---

### Navigation

| Component | Description | Anatomy | Key Props (Themes) |
| :--- | :--- | :--- | :--- |
| **Tabs** | A set of layered content sections displayed one at a time. | `Root`, `List`, `Trigger`, `Content` | `size`, `color` |
| **TabNav** | Navigation links styled as tabs for page routing. | `Root`, `Link` | `size`, `color` |
| **NavigationMenu** (Primitive) | A collection of links for website navigation, with dropdown support. | `Root`, `List`, `Item`, `Trigger`, `Content`, `Link`, `Indicator` | |

---

### Unstyled Primitives & Utilities

This section covers popular primitives that don't have a direct, one-to-one component in Radix Themes or are used for their unstyled behavior.

| Primitive | Description | Anatomy |
| :--- | :--- | :--- |
| **Accordion** | A vertically stacked set of collapsible panels. | `Root`, `Item`, `Header`, `Trigger`, `Content` |
| **Collapsible**| An interactive component which expands/collapses a single panel. | `Root`, `Trigger`, `Content` |
| **Toggle** | A simple two-state on/off button. | `Root` |
| **ToggleGroup**| A set of `Toggle` buttons. | `Root`, `Item` |
| **Toolbar** | A container for grouping controls like buttons and menus. | `Root`, `Button`, `Link`, `Separator`, `ToggleGroup` |
| **Portal** | Renders its children into a new part of the DOM (usually `body`). | `Root` |
| **Slot** | Merges props and behavior onto its immediate child. The engine for `asChild`. | `Root`, `Slottable` |
| **VisuallyHidden**| Hides content from the screen but keeps it for screen readers. | `Root` |
| **AccessibleIcon**| Makes an icon accessible by adding a hidden label. | `Root` |
