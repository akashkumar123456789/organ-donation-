# 📖 User Guide - Organ Donation Management System

## 🚀 Getting Started

### Step 1: Start the Server
```bash
cd organ-donation-
python app.py
```
You should see: `Server running on http://localhost:8000`

### Step 2: Open in Browser
Navigate to: `http://localhost:8000`

---

## 🏠 Home Page

The home page welcomes you with:
- 🫀 Hero icons representing the medical theme
- 🚀 "Get Started" button → Takes you to Dashboard
- 👥 "View Donors" button → Takes you to Donors page

---

## 📊 Dashboard Page

### What You'll See:
1. **Statistics Cards** (Top Section)
   - 🩸 Available Donors count
   - 🏥 Waiting Patients count
   - 🔄 Active Matches count
   - ✅ Successful Surgeries count

2. **Export Buttons**
   - 📄 Export All - Downloads complete dataset
   - 🩸 Donors - Downloads donor data only
   - 🏥 Patients - Downloads patient data only
   - 🏢 Hospitals - Downloads hospital data only
   - 🔄 Matches - Downloads match data only
   - 📋 Records - Downloads medical records only

3. **Comprehensive Table**
   - Shows all data in one view
   - Color-coded urgency levels
   - Status badges for each stage

---

## 🩸 Donors Page

### View Donors
- Table shows: Name, Blood Group, Organ Type, Contact, Status
- Status badges: Green = Available, Gray = Matched

### Add New Donor
1. Click **"Add New Donor"** button
2. Fill in the form:
   - Name (required)
   - Blood Group (O+, O-, A+, A-, B+, B-, AB+, AB-)
   - Organ Type (Kidney, Liver, Heart, Lungs, Pancreas)
   - Contact (format: XXX-XXXX)
3. Click **"Add Donor"**

### Edit Donor
1. Click **"Edit"** button on any donor row
2. Modify the information
3. Click **"Update Donor"**

### Delete Donor
1. Click **"Delete"** button
2. Confirm the action
3. Donor is removed from system

---

## 🏥 Patients Page

### View Patients
- Table shows: Name, Blood Group, Organ Needed, Urgency Level, Contact, Status
- Urgency levels: 1-10 (color-coded)
  - 🔴 Red (8-10): High urgency
  - 🟡 Yellow (5-7): Medium urgency
  - 🟢 Green (1-4): Low urgency

### Add New Patient
1. Click **"Register New Patient"** button
2. Fill in the form:
   - Name (required)
   - Blood Group (required)
   - Organ Needed (required)
   - Urgency Level (1-10 scale)
   - Contact
3. Click **"Register Patient"**

### Update Patient
1. Click **"Edit"** button
2. Modify urgency level or other details
3. Click **"Update Patient"**

### Remove Patient
1. Click **"Delete"** button
2. Confirm removal
3. Patient removed from waitlist

---

## 🏢 Hospitals Page

### View Hospitals
- Table shows: Name, Location, Capacity, Operating Status
- Status types:
  - 🔵 Active - Accepting patients
  - 🟡 Full - At capacity
  - ⚫ Maintenance - Temporarily closed

### Add Hospital
1. Click **"Add New Hospital"** button
2. Fill in:
   - Hospital Name
   - Location
   - Capacity (number of beds)
   - Operating Status
3. Click **"Add Hospital"**

### Update Hospital
1. Click **"Edit"** button
2. Change operating status or capacity
3. Click **"Update Hospital"**

### Remove Hospital
1. Click **"Delete"** button
2. Confirm deletion

---

## 🔄 Matches Page

### View Matches
- Table shows: Donor, Patient, Hospital, Stage, Created Date
- Stages:
  - ⚫ Initiated - Match just created
  - 🔵 Procurement - Organ being retrieved
  - 🟣 In Transit - Organ being transported
  - 🔴 Surgery - Operation in progress
  - 🟢 Completed - Surgery finished

### Initiate New Match
1. Click **"Initiate New Match"** button
2. Select from dropdowns:
   - Donor (only Available donors shown)
   - Patient (only Waiting patients shown)
   - Hospital (only Active hospitals shown)
3. Click **"Initiate Match"**

### Update Match Stage
1. Click **"Update Stage"** button
2. Select new stage from dropdown
3. Click **"Update Stage"**
4. Progress: Initiated → Procurement → In Transit → Surgery → Completed

### Cancel Match
1. Click **"Cancel"** button
2. Confirm cancellation
3. Match is removed (use for medical mismatches)

---

## 📋 Records Page

### View Medical Records
- Table shows: Donor, Patient, Surgery Date, Success Status, Notes, Follow-up
- Success statuses:
  - 🟢 Successful
  - 🟡 Partial Success
  - 🔴 Failed
  - 🟠 Complications

### Add Surgery Report
1. Click **"Add Surgery Report"** button
2. Select completed match from dropdown
3. Fill in:
   - Surgery Date
   - Success Status
   - Surgery Notes (detailed observations)
4. Click **"Add Record"**

### Edit Medical Record
1. Click **"Edit"** button
2. Update any field
3. Add follow-up notes (6 months later)
4. Click **"Update Record"**

### Delete Record
1. Click **"Delete"** button
2. Confirm deletion
3. Record removed (use for draft reports)

---

## 🎯 Common Workflows

### Workflow 1: Complete Organ Donation Process
```
1. Register Donor (Donors Page)
   ↓
2. Register Patient (Patients Page)
   ↓
3. Add Hospital (Hospitals Page)
   ↓
4. Create Match (Matches Page)
   ↓
5. Update Stage: Initiated → Procurement → Surgery → Completed
   ↓
6. File Surgery Report (Records Page)
   ↓
7. Add Follow-up Notes (after 6 months)
```

### Workflow 2: Urgent Patient Registration
```
1. Go to Patients Page
2. Click "Register New Patient"
3. Set Urgency Level to 9 or 10
4. System highlights in RED
5. Prioritize for matching
```

### Workflow 3: Export Data for Reports
```
1. Go to Dashboard
2. Click desired export button
3. CSV file downloads automatically
4. Open in Excel/Google Sheets
5. Generate reports
```

---

## 💡 Tips & Best Practices

### For Donors
- ✅ Always verify blood group before adding
- ✅ Keep contact information updated
- ✅ Mark as "Matched" when assigned to patient
- ✅ Include all available organ types

### For Patients
- ✅ Update urgency levels as condition changes
- ✅ Higher urgency (8-10) gets priority
- ✅ Keep accurate blood group information
- ✅ Update status when transplant received

### For Hospitals
- ✅ Update operating status regularly
- ✅ Set realistic capacity numbers
- ✅ Mark as "Full" when at capacity
- ✅ Use "Maintenance" for temporary closures

### For Matches
- ✅ Only match compatible blood types
- ✅ Progress stages in order
- ✅ Cancel if medical mismatch found
- ✅ Complete all stages before filing record

### For Records
- ✅ File report immediately after surgery
- ✅ Include detailed surgery notes
- ✅ Add follow-up notes at 6 months
- ✅ Mark success status accurately

---

## 🔍 Search & Filter (Coming Soon)

### Search Functionality
- Type in search box to filter table
- Searches across all columns
- Real-time results

### Filter Options
- Filter by blood type
- Filter by organ type
- Filter by status
- Filter by urgency level

---

## 📱 Keyboard Shortcuts

- `Esc` - Close modal
- `Enter` - Submit form (when focused)
- `Tab` - Navigate between fields
- `Ctrl/Cmd + P` - Print current page

---

## ⚠️ Important Notes

### Data Validation
- All required fields must be filled
- Blood groups must match standard types
- Urgency levels must be 1-10
- Contact format: XXX-XXXX

### Status Management
- Donor status: Available → Matched
- Patient status: Waiting → Matched → Transplanted
- Hospital status: Active → Full → Maintenance
- Match stage: Initiated → ... → Completed

### Data Integrity
- Cannot delete donors with active matches
- Cannot delete patients with active matches
- Cannot delete hospitals with active matches
- Must complete match before filing record

---

## 🆘 Troubleshooting

### Server Won't Start
```bash
# Check if port 8000 is in use
lsof -i :8000

# Kill existing process
kill -9 <PID>

# Restart server
python app.py
```

### Database Issues
```bash
# Delete and recreate database
rm organ_donation.db
python app.py
python insert_sample_data.py
```

### Browser Issues
- Clear cache: Ctrl+Shift+Delete
- Hard refresh: Ctrl+Shift+R
- Try incognito mode
- Check console for errors (F12)

---

## 📞 Support

For issues or questions:
1. Check PROJECT_SUMMARY.md
2. Review FEATURES.md for roadmap
3. Run test suite: `python test_all_operations.py`
4. Check server logs: `tail -f server.log`

---

## 🎓 Learning Resources

### Understanding the Code
- `app.py` - HTTP server setup
- `router.py` - API endpoint routing
- `controllers/` - Business logic
- `database/connection.py` - Database operations
- `frontend/assets/js/` - Frontend logic

### Extending the System
1. Add new controller in `controllers/`
2. Add routes in `router.py`
3. Create frontend controller in `frontend/assets/js/controllers/`
4. Add navigation link in `index.html`
5. Test with `test_all_operations.py`

---

**Happy Managing! 🏥💝**

*Saving lives through technology, one match at a time.*
