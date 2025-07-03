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
- **Testing**: Section 15 in claude_backend_rules.md - MANDATORY comprehensive testing standards

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
   - **UNIT TESTING (MANDATORY):** Follow Section 18 standards in claude_backend_rules.md and Unit Testing Workflow (MANDATORY) in this document
     - Create comprehensive test suite (Service, Route, Integration, KO Rules)
     - Use real PostgreSQL models (NOT mocks)
     - Test with UNITTEST prefix for data isolation
     - Verify all positive and negative test cases
     - Test multi-language support and business rules compliance
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

### **🧪 Unit Testing Workflow (MANDATORY):**
**Trigger:** When user asks for unit tests: `"create unit test untuk api [endpoint]"`

**📝 TESTING PROTOCOL:**
- **MUST RESPOND:** "Creating comprehensive unit test suite following Section 18 standards..."
- **MUST IMPLEMENT:** All 5 test layers (Service, Route, Integration, KO Business Rules, Security)
- **MUST USE:** Real PostgreSQL models with existing database connections
- **MUST FOLLOW:** UNITTEST prefix pattern for test data isolation

**CRITICAL TESTING STEPS (Must be followed in exact order):**

**🔍 PRE-TEST VALIDATION (MANDATORY):**
1. **📋 Implementation Verification:**

   - ✅ **Core Dependencies:** Read and understand all require() statements from implementation files
   - ✅ Verify API sudah fully implemented dan berjalan
   - ✅ Check database models dan associations sudah benar  
   - ✅ Verify API contract compliance dengan manual testing
   - ✅ Confirm business rules sudah terimplementasi
   - **CHECKPOINT:** Implementation validated before testing

2. **🛠️ Test Environment Setup:**
   - ✅ Database connection configuration verified
   - ✅ Test database isolation (separate from dev/prod)
   - ✅ Required dependencies installation checked
   - ✅ Environment variables for testing configured
   - **CHECKPOINT:** Test environment ready

**🧪 CORE TESTING EXECUTION:**
3. **📋 Test Standards Review:** Read claude_backend_rules.md Section 18 standards
4. **🏗️ Test Structure Creation:** Create 5 test layers with proper Jest hooks
5. **🔧 Database Integration:** Use real models with UNITTEST cleanup pattern
6. **🌐 Language Testing:** Test with valid UUID language IDs (not string codes)
7. **📊 KO Compliance:** Test all business rules from KO documentation

**🔄 TEST EXECUTION WORKFLOW:**
8. **Setup Phase** → Database cleanup + test data preparation
9. **Service Layer** → Test business logic dalam isolasi
10. **Route Layer** → Test HTTP endpoints dengan supertest
11. **Integration** → Test end-to-end flow
12. **KO Compliance** → Test setiap business rule dari KO docs
13. **Security** → Test attack vectors dan vulnerabilities
14. **Cleanup Phase** → Verify no test data tersisa

**🚨 FAILURE HANDLING PROTOCOL:**
15. **Test Failure Analysis:**
    - ✅ Analyze failure root cause
    - ✅ Check if implementation vs test mismatch
    - ✅ Verify database state dan cleanup
    - ✅ Fix ONE test at a time
    - ✅ Re-run specific test layer
    - ✅ Document lesson learned
    - **CHECKPOINT:** All failures resolved systematically

**⚡ PERFORMANCE TESTING (OPTIONAL):**
16. **Performance Validation:**
    - Response time benchmarks (< 200ms for CRUD)
    - Database query optimization checks
    - Memory usage monitoring
    - Concurrent request handling (10+ requests)
    - **CHECKPOINT:** Performance standards met

17. **✅ Final Verification:** Run complete test suite and fix any remaining issues

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