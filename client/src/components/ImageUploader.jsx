import React, { useState } from 'react';
import axios from 'axios';

const ImageUploader = () => {
  const [imageUrl, setImageUrl] = useState('');

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'chat_uploads'); // your unsigned preset
    formData.append('cloud_name', 'ranadeep_demo');   // your cloud name

    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/ranadeep_demo/image/upload',
        formData
      );
      const uploadedUrl = res.data.secure_url;
      setImageUrl(uploadedUrl);
      console.log('Uploaded URL:', uploadedUrl);
    } catch (err) {
      console.error('Upload Error:', err);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      {imageUrl && <img src={imageUrl} alt="Uploaded" width="200" />}
    </div>
  );
};

export default ImageUploader;