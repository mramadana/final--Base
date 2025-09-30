<template>
  <div ref="uploaderContainer">
    <input
      v-if="!readOnly"
      :class="IsMultible ? 'multiple-input' : '' + readOnly ? 'readOnly' : ''"
      type="file"
      :multiple="IsMultible"
      ref="deleteVal"
      :name="name"
      :accept="acceptedFiles"
      @change="handleFileChange" />
  <div :class="IsMultible ? 'multiple-images' : 'single-image'">
    <TransitionGroup name="image-list" tag="div" class="images-container">
      <div
        class="uploaded-block" v-for="(image, index) in uploadedImages"
        :key="image.url">
        <img
          v-if="acceptedFiles == 'image/*' || image.file.type.startsWith('image/')"
          :src="image.url"
        />
        <div class="file-block" v-else-if="image.file.type.startsWith('application/')">
          <font-awesome-icon :icon="['fas', 'file']" />
          <p class="file-name">{{ image.file.name }}</p>
        </div>
        <button type="button" class="remove-btn" @click="removeImage(index)">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </TransitionGroup>
  </div>
  
   <!-- Validation Error Message -->
   <div v-if="showValidation && !uploadedImages.length" style="color: red; font-size: 12px; margin-top: 5px;">
       {{ errorMessage }}
   </div>
  </div>
</template>

<script>

export default {

  props: {
    acceptedFiles: String,
    name: String,
    IsMultible: Boolean,
    customProp: String,
    newImages: [Array, String, Object],
    readOnly: Boolean,
    resetTrigger: Number,
    showValidation: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String,
    }
  },
data() {
  return {
    uploadedImages: [],
  //   acceptedFiles: "application/*",
  };
},

computed: {
  hasValidationError() {
    return this.showValidation && this.required && this.uploadedImages.length === 0;
  }
},

methods: {
  handleFileChange(event) {
    if(this.readOnly) return;
    let selectedFiles = event.target.files;

    if (this.validateImageSize(selectedFiles)) {
      if(this.IsMultible) {
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          const imageUrl = URL.createObjectURL(file);
          this.uploadedImages.push({ url: imageUrl, file });
        }
        // Emit array of files for multiple images
        this.$emit("uploaded-images-updated", this.uploadedImages.map(img => img.file));
      } else {
        const file = selectedFiles[0];
        const imageUrl = URL.createObjectURL(file);
        this.uploadedImages = [{ url: imageUrl, file }];
        // Emit single file for single image
        this.$emit("uploaded-images-updated", this.uploadedImages[0].file);
      }
    } else {
      console.log('Image size exceeds the maximum limit');
    }
    event.target.value = null;
  },

  validateImageSize(files) {
    const maxSizeInBytes = 20 * 1024 * 1024; // 20MB

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > maxSizeInBytes) {
        return false; // Image size exceeds the maximum limit
      }
    }

return true; // All images are within the size limit
},
  
 removeImage(index) {
   const removed = this.uploadedImages[index];
   // pass the image id to parent
   if (removed.id) {
     this.$emit('remove-image', removed.id);
   }
   // remove the image from the list
   this.uploadedImages.splice(index, 1);
   // pass the updated array of File objects to parent
   const files = this.uploadedImages.map(i => i.file).filter(f => f);
   this.$emit('uploaded-images-updated', files);
 },

 // validation function
 validate() {
   if (this.required && this.uploadedImages.length === 0) {
     // pass error to parent
     this.$refs.uploaderContainer.scrollIntoView({ 
       behavior: 'smooth', 
       block: 'center' 
     });
     return false;
   }
   return true;
 }
},

mounted() {
  watchEffect(() => {
    if (this.newImages) {
      if (this.IsMultible && Array.isArray(this.newImages)) {
        // Handle multiple images
        this.uploadedImages = this.newImages.map(img => ({
          url: img.image || img.url || img,
          file: null,
          id: img.id || null
        }));
      } else {
        // Handle single image
        this.uploadedImages = [{ 
          url: typeof this.newImages === 'object' ? (this.newImages.image || this.newImages.url) : this.newImages, 
          file: null,
          id: typeof this.newImages === 'object' ? this.newImages.id : null
        }];
      }
    }
  });
},

watch: {
  resetTrigger() {
    // Reset uploaded images when resetTrigger changes
    console.log('Component reset triggered:', this.resetTrigger);
    this.uploadedImages = [];
    this.$emit("uploaded-images-updated", []);
  }
},

};

</script>

<style lang="scss">
.input_auth {
    width: 130px;
    height: 130px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #E21876;
    border-radius: 50%;
    position: relative;
    input[type="file"] {
      width: 100%;
      height: 100%;
      position: absolute;
      opacity: 0;
      overflow: hidden;
      cursor: pointer;
    }
    .uploaded-block {
      position: absolute;
      margin: 0;
      // left: 0;
      // top: 0;
      // width: 100%;
      // height: 100%;
      left: 50%;
      top: 50%;
      width: 95%;
      height: 95%;
      transform: translate(-50%, -50%);
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
}

.multiple-images {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  
  .images-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    width: 100%;
  }

  .uploaded-block {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 10px;
    overflow: hidden;
    transition: all 0.3s ease;
    will-change: transform, opacity;
    display: flex;
    align-items: center;
    justify-content: center;
    &::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: hsl(0deg 1% 21% / 25%);
      transition: opacity 0.3s ease;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .file-name {
      font-size: 11px;
    }
  }

  .file-block {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
    word-break: break-all;
    padding: 10px;
  }

  .remove-btn {
    position: absolute;
    transform: none !important;
    top: 5px;
    left: 5px !important;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background-color: var(--main);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.1) !important;
    }
  }
}

// Transition animations
.image-list-move, 
.image-list-enter-active,
.image-list-leave-active {
  transition: all 0.3s ease;
}

.image-list-enter-from {
  opacity: 0;
  transform: scale(0.6);
}

.image-list-leave-to {
  opacity: 0;
  transform: scale(0.6);
}

.image-list-leave-active {
  position: absolute;
  width: 100px;
  height: 100px;
}

.multiple-input {
  width: 100%;
  height: 45px;
  position: absolute;
  opacity: 0;
  overflow: hidden;
  cursor: pointer;
  right: 0;
  top: 0;
}


</style>