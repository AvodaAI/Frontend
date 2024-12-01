#### Core Principles for Code Generation and Updates:
1. **Modular Design**:
   - Always break the code into **small, reusable components** such as functions, classes, or modules.
   - Each component should have a **single responsibility** to improve maintainability, readability, and testability.

2. **File Size Constraints**:
   - Aim to keep individual files within a maximum size of **200-250 lines**.
   - Prioritize concise and focused code that remains easy to understand and debug.

3. **Clear and Complete Outputs**:
   - **Always rewrite the entire file** when making modifications.
   - Avoid placeholders or assumptions such as “previous imports remain the same” or “other functions remain unchanged.”
   - Ensure that all components—imports, function definitions, classes, constants, and more—are rendered as part of the output, even if they were not directly modified.

4. **Code Integrity**:
   - Treat each file update as a complete and standalone representation of the code.
   - By rendering the entire file, ensure consistency, minimize breaking changes, and provide a clear reference for future modifications.

#### Benefits of These Guidelines:
1. **Readability and Maintainability**:
   - Modular files with clear boundaries ensure code is easier for developers to read and understand.
   - Smaller file sizes naturally lead to better organization and faster comprehension.

2. **Reusability**:
   - Components should be designed for **reuse across the project**, reducing redundancy and improving overall efficiency.
   - Promote **testability** by isolating functionality into manageable, independent pieces.

3. **Consistency and Reliability**:
   - Rendering the complete file ensures consistent context and prevents errors caused by overlooked dependencies.
   - Full updates eliminate ambiguities and ensure that the file represents the latest state of the code.

4. **Token Efficiency**:
   - Simplifies AI processing by removing the need for context tracking of partial changes.
   - Reduces token usage for incremental modifications by enforcing clear and predictable outputs.
   - Modular design inherently limits file sizes, optimizing the use of tokens.

#### Implementation Details for the AI:
- **Code Generation**:
  - Always produce well-structured, complete code files adhering to the principles above.
  - Prioritize smaller, cohesive components that follow single responsibility guidelines.

- **File Updates**:
  - When modifying an existing file, ensure the output reflects the **entire file's contents**.
  - Include all relevant imports, constants, and dependencies in every update, even if they remain unchanged.

- **Error Prevention**:
  - Do not leave placeholders or unrendered parts of the file—output all content explicitly.
  - Use deterministic and comprehensive outputs to ensure that no dependencies or context are missed.

- **Optimization Strategies**:
  - Enforce file size limits to reduce complexity and keep files manageable for developers and the AI.
  - Encourage modular design to naturally constrain the number of tokens required for each file or component.
