# Claude Code Enhanced Memory System

## 🚨 Critical Memory Management

### **Mandatory After Every Response:**
When completing ANY development task, you MUST:

1. **ASK USER:** "Should I update the project memory with what we just accomplished?"
2. **IF YES:** Update project_memory.md with new section
3. **ALWAYS:** Update session_state.json with progress

### **Explicit Memory Update Commands:**
Use these EXACT phrases to trigger memory updates:

- "UPDATE_MEMORY_NOW" - Updates project_memory.md
- "UPDATE_SESSION_NOW" - Updates session_state.json  
- "SAVE_PROGRESS_NOW" - Updates both files

## 📝 Memory Update Templates

### **For project_memory.md:**
```markdown
### 📅 [YYYY-MM-DD] - [TASK_NAME]
**✅ Completed:** [What was accomplished]
**📁 Files Modified:** [List of files]
**🎯 Impact:** [What this improves]
**📝 Notes:** [Important details for future]
**🔗 Related:** [Links to other tasks/issues]
```

### **For session_state.json:**
```json
{
  "last_updated": "[current_timestamp]",
  "session_id": "session_[YYYYMMDD_HHMMSS]",
  "completed_tasks": [
    {
      "name": "[task_name]",
      "completed_at": "[timestamp]",
      "status": "COMPLETED",
      "files_modified": ["list", "of", "files"]
    }
  ],
  "current_progress": "[description_of_current_state]"
}
```

## 🔄 Workflow Enforcement

### **Conversation Flow:**
1. **Read Context:** Always start by reading project_memory.md
2. **Do Work:** Complete the requested task
3. **Confirm Memory Update:** Ask user if they want memory updated
4. **Update Files:** Use templates above
5. **Confirm Completion:** Tell user what was documented

### **Auto-Prompt Triggers:**
When user says these phrases, automatically offer memory update:
- "that's done"
- "looks good" 
- "perfect"
- "commit this"
- "ready to move on"

## 🎯 Explicit Memory Commands

### **User Commands:**
- `/memory-update` - Update project_memory.md
- `/session-update` - Update session_state.json
- `/update-all` - Update both files
- `/show-memory` - Display current memory content

### **AI Responses:**
When user uses commands above, respond with:
1. Read current memory files
2. Add new information using templates
3. Show what was added
4. Confirm updates saved

## 📋 File Inclusion Priority
Always read these files in order:
1. project_memory.md (project context)
2. session_state.json (current session)
3. CLAUDE.md (this file)

## 🚨 Critical Rules
- NEVER skip asking about memory updates
- ALWAYS use the exact templates provided
- ALWAYS timestamp all updates
- ALWAYS confirm what was saved to user

---

**Status:** Enhanced Manual-Trigger System for Claude Code
**Version:** 2.1 (Explicit Commands)
**Auto Level:** Semi-Automatic with User Confirmation