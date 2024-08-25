export const imageUpload = async (imageName, file) => {
    return await file
        .mv(process.cwd() + "/images/" + imageName)
        .then((data) => true) //if file move folder
        .catch((e) => {
            console.log(e);
            return false
        });
};