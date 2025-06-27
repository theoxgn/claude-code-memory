# Claude Code Enhanced Memory System

## 🏗️ Backend Development Rules
**MANDATORY**: All backend development MUST follow the rules defined in `claude_backend_rules.md`

### Quick Reference:
- **Architecture**: Node.js/Express with Sequelize ORM
- **Naming**: snake_case for files, PascalCase for classes
- **Models**: MT prefix, UUID primary keys, inline associations
- **Controllers**: Export instantiated classes, use MessageHelper
- **Services**: Database transactions, ResponseError handling
- **Validation**: express-validator with sanitization
- **Authentication**: JWT with authMuatpartsRequired middleware

**⚠️ CRITICAL**: Read `claude_backend_rules.md` before generating any backend code!

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

### **General Conversation Flow:**
1. **Read Context:** Always start by reading project_memory.md
2. **Do Work:** Complete the requested task
3. **Confirm Memory Update:** Ask user if they want memory updated
4. **Update Files:** Use templates above
5. **Confirm Completion:** Tell user what was documented

### **🎯 API Implementation Workflow (MANDATORY):**
**Trigger:** When user says `"implementasi <<path api>>"`

**🚨 ENFORCEMENT PROTOCOL:**
- **MUST RESPOND:** "Starting API implementation with 6-step verification process..."
- **MUST SHOW:** Checklist progress for each step
- **MUST CONFIRM:** Each step completion before proceeding
- **CANNOT SKIP:** Any step regardless of API complexity

**CRITICAL STEPS (Must be followed in exact order):**

1. **📋 File Inclusion Priority (MANDATORY):**
   - ✅ Read project_memory.md (project context) → **CONFIRM COMPLETED**
   - ✅ Read session_state.json (current session) → **CONFIRM COMPLETED**
   - ✅ Read CLAUDE.md (this file) → **CONFIRM COMPLETED**
   - ✅ Read claude_backend_rules.md (backend-specific rules) → **CONFIRM COMPLETED**
   - **CHECKPOINT:** All mandatory files read and understood

2. **📄 API CONTRACT INTERPRETATION (CRITICAL):**
   - ✅ Find API specification in `ai/api_kontrak.md` → **CONFIRM FOUND**
   - ✅ Read API contract LITERALLY → **QUOTE EXACT SPECIFICATION**
   - ✅ Store contract details → **LIST: method, path, headers, body, response**
   - **CHECKPOINT:** Contract interpreted without assumptions, exact specification documented

3. **📚 BUSINESS RULES DISCOVERY:**
   - ✅ Identify KO references from contract → **LIST FOUND KO REFERENCES**
   - ✅ Search `ai/rules/` folder → **LIST FOUND RULE FILES**
   - ✅ Read related rules → **SUMMARIZE KEY BUSINESS LOGIC**
   - **CHECKPOINT:** Business rules documented and understood

4. **🔍 COMPREHENSIVE VERIFICATION (CRITICAL):**
   - **📊 MODEL VERIFICATION:**
     - Read ALL related model files in `src/models/muattrans/`
     - Verify field names and data types (camelCase vs snake_case)
     - Check model associations and aliases (`as: 'additionalService'`)
     - Verify database connections
     - Read enum files in `src/enums/`
     - Verify enum keys vs display text
     - Check enum usage in models and services
   - **🔗 SERVICE DEPENDENCIES:**
     - Check existing service imports and patterns
     - Verify helper imports (MessageHelper, ResponseError)
     - Check middleware imports (authMuatpartsRequired)
   - **📁 FILE STRUCTURE COMPLIANCE:**
     - Verify route structure and mounting points
     - Check controller/service naming patterns
     - Validate import paths and file organization
   - ✅ **VERIFICATION COMPLETE** → **OUTPUT COMPLETE VERIFICATION REPORT**
   - **CHECKPOINT:** All technical specifications verified and documented
   - **MANDATORY:** Cannot proceed to implementation without verification report

5. **🏗️ IMPLEMENTATION EXECUTION:**
   - Follow claude_backend_rules.md patterns (Route → Controller → Service → Validation)
   - Implement exactly per API contract specification
   - Apply business rules from KO documents
   - Use verified model fields and enum values (from step 4)
   - Use ORM models with proper field verification
   - Include proper error handling and transactions

6. **✅ VALIDATION & TESTING:**
   - Test implementation matches API contract exactly
   - Verify business rules are correctly applied
   - **SYSTEMATIC DEBUGGING PROTOCOL:**
     1. Read error message completely
     2. Trace back to model/enum definition
     3. Fix ONE error at a time
     4. Test after each fix
     5. Document fix in memory
   - Update memory with lessons learned

**⚠️ CRITICAL COMPLIANCE RULES:**
- **API Contract is Source of Truth** - NEVER deviate
- **Literal interpretation** - NO creative additions
- **Business rules must be applied** from KO documents
- **Follow backend rules** for implementation patterns

**🚨 MANDATORY ENFORCEMENT:**
- **CANNOT SKIP STEPS** - Each step must show completion confirmation
- **CANNOT ASSUME** - Must verify with source files and quote exact findings
- **CANNOT PROCEED** - Without completing verification report
- **MUST SHOW PROGRESS** - Checklist completion for each step
- **MUST QUOTE SOURCES** - API contract, model fields, enum values

**🛡️ FAILURE SAFEGUARDS:**
- **If skipping step detected** → STOP and restart from step 1
- **If assumption detected** → STOP and verify with source files
- **If verification incomplete** → CANNOT proceed to implementation
- **If error occurs** → Systematic debugging protocol (one error at a time)

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

## 📋 File Inclusion Priority (MANDATORY)
MUST ALWAYS read these files in order:
1. project_memory.md (project context)
2. session_state.json (current session)
3. CLAUDE.md (this file)
4. claude_backend_rules.md (backend-specific rules - MANDATORY)

## 🚨 Critical Rules
- NEVER skip asking about memory updates
- ALWAYS use the exact templates provided
- ALWAYS timestamp all updates
- ALWAYS confirm what was saved to user

---

**Status:** Enhanced Manual-Trigger System for Claude Code
**Version:** 2.1 (Explicit Commands)
**Auto Level:** Semi-Automatic with User Confirmation