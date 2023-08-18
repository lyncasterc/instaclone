import React, { useState } from 'react';
import {
  useEditUserMutation,
  useDeleteUserImageMutation,
} from '../../app/apiSlice';

/**
 * Custom hook for handling the user image upload/delete logic
 * in the `UserProfileEdit` and `UserProfileInfo` components.
 *
 * @param {React.Dispatch<React.SetStateAction<string>>} setAlertText -
 * Function to update the alert text, used in the event handler functions.
 *
 * Returns:
 * - the event handler functions for uploading and deleting user images,
 * - an object containing:
 *    -  `isDeleting` - indicates the loading state for the mutation for deleting the user image.
 *    - `isImageUpdating` - indicates the loadcing state for the mutation updating the user image.
 *    -  `modalOpened`, `setModalOpened` - the stateful value and it's update
 *  function to indicate/change the opened/closed state of the `ChangeAvatarModal`.
 */

function useUserProfileImageUpload(
  setAlertText: React.Dispatch<React.SetStateAction<string>>,
) {
  const [modalOpened, setModalOpened] = useState(false);
  const [updateImage, { isLoading: isImageUpdating }] = useEditUserMutation();
  const [deleteUserImage, { isLoading: isDeleting }] = useDeleteUserImageMutation();

  /**
   * Handles the onChange event for the image file input event
   * in `UserProfileEdit` and `UserProfileInfo`.
   *
   * It sends the PUT request and show the appropiate alert.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The file input event.
   * @param {string} id - The user's id.
   */
  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
  ) => {
    if (!e.target.files) return;

    const fileReader = new FileReader();
    fileReader.onload = async () => {
      if (fileReader.readyState === 2) {
        try {
          await updateImage({
            updatedUserFields: {
              imageDataUrl: fileReader.result as string,
            },
            id,
          }).unwrap();
          if (modalOpened) setModalOpened(false);
          setAlertText('Profile photo added.');
        } catch (error) {
          // TODO: remove log, display error message
          console.log(error);
        }
      }
    };
    fileReader.readAsDataURL(e.target.files[0]);
  };

  /**
   * Handles the onClick event for the button to remove the current photo in `ChangeAvatarModal`.
   *
   * It will sent the DELETE request and show the appropriate alert.
   * @param {string} id - The user's id.
   * @async
   */
  const onRemoveBtnClick = async (id: string) => {
    try {
      await deleteUserImage(id).unwrap();
      setModalOpened(false);
      setAlertText('Photo photo removed.');
    } catch (error) {
      console.error(error);
    }
  };

  return [
    handleFileInputChange,
    onRemoveBtnClick,
    {
      isDeleting,
      isImageUpdating,
      modalOpened,
      setModalOpened,
    },
  ] as const;
}

export default useUserProfileImageUpload;
