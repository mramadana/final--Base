export const useFormValidation = () => {
  
  const isFormValid = (formData, validations) => {
    // فحص الحقول العادية
    const fieldsValid = Object.keys(validations).every(field => {
        try { 
            validations[field].validateSync(formData[field]); 
            return true; 
        } catch { 
            return false; 
        }
    });
    
    // فحص الـ dropdowns
    const dropdownsValid = formData.defaultSection && formData.defaultSection2;
    
    return fieldsValid && dropdownsValid;
  };

  // دالة لإعادة تعيين الفورم
  const resetForm = (formData, showValidation = null) => {
    Object.keys(formData).forEach(key => {
      formData[key] = null;
    });
    
    // إعادة تعيين حالة الـ validation إذا تم تمريرها
    if (showValidation !== null) {
      showValidation.value = false;
    }
  };

  // دالة للعثور على أول عنصر غير صالح والتمرير إليه
  const scrollToFirstError = (formData, validations) => {
    // فحص الحقول العادية
    for (const field of Object.keys(validations)) {
      try {
        validations[field].validateSync(formData[field]);
      } catch {
        // إذا وجد خطأ، ابحث عن العنصر وتمرر إليه
        const element = document.querySelector(`input[name="${field}"], select[name="${field}"]`);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          element.focus();
          return field; // إرجاع اسم الحقل الأول المخطئ
        }
      }
    }

    // فحص الـ dropdowns
    if (!formData.defaultSection) {
      const element = document.querySelector('.dropdown_card');
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        return 'defaultSection';
      }
    }

    if (!formData.defaultSection2) {
      const elements = document.querySelectorAll('.dropdown_card');
      if (elements[1]) {
        elements[1].scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        return 'defaultSection2';
      }
    }

    return null; // لا توجد أخطاء
  };

  return {
    isFormValid,
    resetForm,
    scrollToFirstError
  };
};
