// Form Validation Utility
class FormValidator {
    static validateName(name) {
        if (!name || name.trim().length === 0) {
            return { valid: false, error: 'Name is required' };
        }
        if (name.trim().length < 2) {
            return { valid: false, error: 'Name must be at least 2 characters' };
        }
        if (name.trim().length > 50) {
            return { valid: false, error: 'Name must be less than 50 characters' };
        }
        if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
            return { valid: false, error: 'Name can only contain letters and spaces' };
        }
        return { valid: true };
    }

    static validateContact(contact) {
        if (!contact || contact.trim().length === 0) {
            return { valid: false, error: 'Contact is required' };
        }
        // Format: XXX-XXXX or 10 digits
        if (!/^\d{3}-\d{4}$/.test(contact) && !/^\d{10}$/.test(contact)) {
            return { valid: false, error: 'Contact must be XXX-XXXX or 10 digits' };
        }
        return { valid: true };
    }

    static validateBloodGroup(bloodGroup) {
        const validGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        if (!validGroups.includes(bloodGroup)) {
            return { valid: false, error: 'Invalid blood group' };
        }
        return { valid: true };
    }

    static validateOrganType(organType) {
        const validOrgans = ['Heart', 'Kidney', 'Liver', 'Lungs', 'Pancreas', 'Cornea'];
        if (!validOrgans.includes(organType)) {
            return { valid: false, error: 'Invalid organ type' };
        }
        return { valid: true };
    }

    static validateUrgencyLevel(level) {
        const num = parseInt(level);
        if (isNaN(num) || num < 1 || num > 10) {
            return { valid: false, error: 'Urgency level must be between 1 and 10' };
        }
        return { valid: true };
    }

    static validateCapacity(capacity) {
        const num = parseInt(capacity);
        if (isNaN(num) || num < 1 || num > 1000) {
            return { valid: false, error: 'Capacity must be between 1 and 1000' };
        }
        return { valid: true };
    }

    static validateLocation(location) {
        if (!location || location.trim().length === 0) {
            return { valid: false, error: 'Location is required' };
        }
        if (location.trim().length < 3) {
            return { valid: false, error: 'Location must be at least 3 characters' };
        }
        if (location.trim().length > 100) {
            return { valid: false, error: 'Location must be less than 100 characters' };
        }
        return { valid: true };
    }

    static validateDate(date) {
        if (!date) {
            return { valid: false, error: 'Date is required' };
        }
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate > today) {
            return { valid: false, error: 'Date cannot be in the future' };
        }
        return { valid: true };
    }

    static validateNotes(notes, maxLength = 500) {
        if (notes && notes.length > maxLength) {
            return { valid: false, error: `Notes must be less than ${maxLength} characters` };
        }
        return { valid: true };
    }

    static showError(message) {
        alert('❌ Validation Error:\n\n' + message);
    }

    static validateDonorForm(data) {
        const errors = [];
        
        const nameCheck = this.validateName(data.name);
        if (!nameCheck.valid) errors.push(nameCheck.error);
        
        const bloodCheck = this.validateBloodGroup(data.blood_group);
        if (!bloodCheck.valid) errors.push(bloodCheck.error);
        
        const organCheck = this.validateOrganType(data.organ_type);
        if (!organCheck.valid) errors.push(organCheck.error);
        
        if (data.contact) {
            const contactCheck = this.validateContact(data.contact);
            if (!contactCheck.valid) errors.push(contactCheck.error);
        }
        
        return errors;
    }

    static validatePatientForm(data) {
        const errors = [];
        
        const nameCheck = this.validateName(data.name);
        if (!nameCheck.valid) errors.push(nameCheck.error);
        
        const bloodCheck = this.validateBloodGroup(data.blood_group);
        if (!bloodCheck.valid) errors.push(bloodCheck.error);
        
        const organCheck = this.validateOrganType(data.organ_needed);
        if (!organCheck.valid) errors.push(organCheck.error);
        
        const urgencyCheck = this.validateUrgencyLevel(data.urgency_level);
        if (!urgencyCheck.valid) errors.push(urgencyCheck.error);
        
        if (data.contact) {
            const contactCheck = this.validateContact(data.contact);
            if (!contactCheck.valid) errors.push(contactCheck.error);
        }
        
        return errors;
    }

    static validateHospitalForm(data) {
        const errors = [];
        
        const nameCheck = this.validateName(data.name);
        if (!nameCheck.valid) errors.push(nameCheck.error);
        
        const locationCheck = this.validateLocation(data.location);
        if (!locationCheck.valid) errors.push(locationCheck.error);
        
        const capacityCheck = this.validateCapacity(data.capacity);
        if (!capacityCheck.valid) errors.push(capacityCheck.error);
        
        return errors;
    }

    static validateRecordForm(data) {
        const errors = [];
        
        if (data.surgery_date) {
            const dateCheck = this.validateDate(data.surgery_date);
            if (!dateCheck.valid) errors.push(dateCheck.error);
        }
        
        if (data.notes) {
            const notesCheck = this.validateNotes(data.notes, 500);
            if (!notesCheck.valid) errors.push(notesCheck.error);
        }
        
        if (data.follow_up_notes) {
            const followUpCheck = this.validateNotes(data.follow_up_notes, 500);
            if (!followUpCheck.valid) errors.push(followUpCheck.error);
        }
        
        return errors;
    }
}

window.FormValidator = FormValidator;
