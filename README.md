# UMLith - UML to Java

UMLith is an interactive React application for designing UML class diagrams and generating Java source code from the resulting architecture.

## Aim

The aim of UMLith is to make object-oriented design easier to visualize and translate into Java. Users can create classes and interfaces, define their members, model relationships, and inspect the generated Java source in one workspace.

## Features

- Create and edit UML class and interface nodes
- Add attributes, methods, method parameters, visibility, data types, and return types
- Connect nodes with association, inheritance, implementation, aggregation, and composition relationships
- Configure relationship labels and multiplicities such as `1`, `0..1`, `0..*`, and `1..*`
- Generate separate Java source views and a combined Java output
- Copy generated code and download `.java` files
- Save and load diagrams with browser localStorage
- Export and import diagrams as JSON files
- Delete selected relationships or nodes and clear the complete diagram
- Responsive interface with animated controls and UML canvas navigation

## Software Requirements

### Runtime requirements

- Node.js 18 or later
- npm 9 or later
- A modern browser such as Microsoft Edge, Google Chrome, or Mozilla Firefox

### Development stack

- React `19.3.0`
- React DOM `19.3.0`
- Vite `7.3.6`
- `@xyflow/react` `12.11.6`
- Framer Motion `12.43.0`
- Lucide React `0.468.0`
- `@vitejs/plugin-react` `5.2.0`

The version ranges are defined in `package.json`; `package-lock.json` records the resolved installation versions.

## Installation and Usage

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173/`. If that port is already in use, Vite selects another available port.

Create classes or interfaces from the toolbar, drag from a source node handle to a target node handle, then select the relationship line to choose its type and multiplicities.

## Production Build

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```text
UMLith-Final/
├── index.html                  # Application HTML entry point
├── package.json                # Scripts and dependency versions
├── package-lock.json           # Locked dependency tree
├── README.md                   # Project documentation
└── src/
    ├── App.jsx                 # Main application layout and diagram events
    ├── App.css                 # Application component styles
    ├── index.css               # Global styles and theme
    ├── main.jsx                # React application bootstrap
    ├── components/
    │   ├── ClassEditor.jsx     # Class and interface editor
    │   ├── ClassNode.jsx       # UML node rendering
    │   ├── CodePanel.jsx       # Generated Java source panel
    │   ├── EdgeEditor.jsx      # Relationship editor
    │   ├── Footer.jsx          # Application footer
    │   ├── Header.jsx          # Application header
    │   ├── Infographic.jsx     # Workflow information section
    │   ├── StatsPanel.jsx      # Diagram statistics
    │   └── Toolbar.jsx         # Diagram actions
    ├── data/
    │   └── javaKeywords.js     # Java keyword/type data
    ├── hooks/
    │   └── useDiagram.js       # Diagram state and node/edge operations
    └── utils/
        ├── diagramStorage.js   # Save, load, import, and export helpers
        ├── javaGenerator.js    # Java source generation
        └── validation.js        # Diagram validation helpers
```

## Screenshots

