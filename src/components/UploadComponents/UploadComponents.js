import React, { useState } from "react";
import toast from 'react-hot-toast';



const UploadComponents = () => {

  const [fileGroups, setFileGroups] = useState([]);    // array of objects -> selected files with corresponding custodians
  const [custodians, setCustodians] = useState([]);   // store custodian names
  const [uploading, setUploading] = useState([]);    // array of booleans -> uploading?
  const [progress, setProgress] = useState([]);     // array of integers -> tracking progress of the file upload



  // Dropzone -> retrieve drop files, store it in a new object to store the files and custodian, update state variable 
  const handleDrop = (e) => {
    e.preventDefault();
    const filesArray = [...e.dataTransfer.files];
    const custodian = "";

    setFileGroups((prevFileGroups) => [...prevFileGroups, { files: filesArray, custodian }]);
    setCustodians((prevCustodians) => [...prevCustodians, custodian]);
    setUploading((prevUploading) => [...prevUploading, false]);
    setProgress((prevProgress) => [...prevProgress, 0]);
  };


  // Browse File Button -> same as Dropzone
  const handleFileSelect = (e) => {
    e.preventDefault();
    const filesArray = [...e.target.files];
    const custodian = "";

    setFileGroups((prevFileGroups) => [...prevFileGroups, { files: filesArray, custodian }]);
    setCustodians((prevCustodians) => [...prevCustodians, custodian]);
    setUploading((prevUploading) => [...prevUploading, false]);
    setProgress((prevProgress) => [...prevProgress, 0]);
  };



  // handle custodian name changes, copy previous values and add new values to the array 
  const handleCustodianChange = (index, e) => {
    const updatedCustodians = [...custodians];
    updatedCustodians[index] = e.target.value;
    setCustodians(updatedCustodians);
  };



  // check which form submitted (index argument), check files + custodian = not empty, set Uploading + progress state true + 0
  // increment progress state by a random value/sec till 100, 
  // after 10sec clear interval, success message 
  const handleSubmit = (index) => (e) => {
    e.preventDefault();

    const currentGroup = fileGroups[index];

    if (currentGroup.files.length === 0 || custodians[index] === "") return;

    setUploading((prevUploading) => {
      const updatedUploading = [...prevUploading];
      updatedUploading[index] = true;
      return updatedUploading;
    });
    setProgress((prevProgress) => {
      const updatedProgress = [...prevProgress];
      updatedProgress[index] = 0;
      return updatedProgress;
    });

    const uploadInterval = setInterval(() => {
      setProgress((prevProgress) => {
        const updatedProgress = [...prevProgress];
        updatedProgress[index] = prevProgress[index] + Math.floor(Math.random() * 20);
        return updatedProgress;
      });
    }, 1000);

    setTimeout(() => {
      clearInterval(uploadInterval);
      setFileGroups((prevFileGroups) => {
        const updatedFileGroups = [...prevFileGroups];
        updatedFileGroups.splice(index, 1);
        return updatedFileGroups;
      });
      setCustodians((prevCustodians) => {
        const updatedCustodians = [...prevCustodians];
        updatedCustodians.splice(index, 1);
        return updatedCustodians;
      });
      setUploading((prevUploading) => {
        const updatedUploading = [...prevUploading];
        updatedUploading.splice(index, 1);
        return updatedUploading;
      });
      setProgress((prevProgress) => {
        const updatedProgress = [...prevProgress];
        updatedProgress.splice(index, 1);
        toast.success('File uploaded successfully!');
        return updatedProgress;
      });
    }, 10000);

  };




  return (
    <div className="">
      <h2 className="mx-10 mt-5 text-3xl">Submit your files: </h2>

      {
        fileGroups.map((group, index) => (
          <div key={index}>
            <form onSubmit={handleSubmit(index)} className="m-10 p-10 bg-green-100 text-center">
              <ul>
                {group.files.map((file) => (
                  <li key={file.name}>
                    {file.name} - {file.size} bytes
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <label htmlFor={`custodian-input-${index}`} className='text-2xl'>Custodian: </label>
                <input
                  type="text"
                  id={`custodian-input-${index}`}
                  value={custodians[index]}
                  onChange={(e) => handleCustodianChange(index, e)}
                  className="input input-bordered border-green-700 w-full max-w-xs"
                />
              </div>

              <div className="">
                <button type="submit" className="btn btn-outline btn-primary px-10 mt-4">
                  Submit
                </button>
              </div>

              {
                uploading[index] && (
                  <div className="progress-bar mt-4">
                    Uploading...
                    <progress value={progress[index]} max="100"></progress>
                  </div>
                )}

            </form>
          </div>
        ))}

      <div
        className="upload-component bg-blue-100 p-20 m-10 text-center border-dashed border-2 border-indigo-600"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input type="file" multiple onChange={handleFileSelect} className="file-input file-input-bordered w-full max-w-xs" />
        <p className="mt-10 font-bold">or drag and drop files here</p>
      </div>

    </div>
  );
}


export default UploadComponents;
