# SerialKit Markdown Syntax: 

This syntax applies to .skit and .skitpage files.

```markdown
### General SerialKit injection syntax
&{}

### To import another SerialKit markdown document into scope (.skit files only)
Regular import: &{import './other_serialkit_document.skit'}
Namespaced import: &{import './other_serialkit_document.skit' as my_other_doc}

### New page (.skit files only)
--- @page_id

### Read from Global Variable (recommended for .skit files only)
Read: &{global_var_name}

### Text fields (can work inline)
Text field with label: &{ TextInput (Label) to (input_id)}
Text field with hidden label: &{ TextInput (~Label) to (input_id)}
Text field with placeholder: &{ TextInput (Label: "Placeholder") to (input_id)}

### Select menus (must be in own block)
Radio buttons with circle at left: 
	&{ Radio (Label1) to (group_name:option_value)}
	&{ Radio (Label2) to (group_name:option_value)}
Numbered options: 
	&{ Radio (1# FirstLabel) to (group_name:option_value)}
	&{ Radio (2# SecondLabel) to (group_name:option_value)}
Multiselect options:
	&{ Checkbox (Label1) to (group_name:option_value)}
	&{ Checkbox (Label2) to (group_name:option_value)}
Numbered links, for pure .skit games:
	&{ Radio (1# FirstLabel) to (group_name:@page_id)}
	&{ Radio (2# SecondLabel) to (group_name:@page_id)}


```