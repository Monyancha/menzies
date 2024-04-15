import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { showNotification } from "@mantine/notifications";
import store from "../../../../store/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Button, TextInput } from "@mantine/core";
import Image from "next/image";
import { Input, Grid, Col, FileInput } from "@mantine/core";
import { getAccountSettings } from "../../../../store/merchants/settings/access-control-slice";
import { IconCloudUpload } from "@tabler/icons";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

const placesLibrary = ["places"];

function AccountSettings() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [website, setWebsite] = useState("");
  //Add Tiktok and Threads
  const [tiktok, setTiktok] = useState("");
  const [threads, setThreads] = useState("");
  const [kraPin, setKraPin] = useState("");
  //loadingPrivacyCode
  const [privacyCode, setPrivacyCode] = useState("");
  const [loadingPrivacyCode, setLoadingPrivacyCode] = useState(false);
  //passwords //loadingPassword
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingPassword, setLoadingPassword] = useState(false);
  //Images //loadingCoverPhoto //profilePhoto
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [loadingCoverPhoto, setLoadingCoverPhoto] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loadingProfilePhoto, setLoadingProfilePhoto] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewCoverUrl, setPreviewCoverUrl] = useState(null);

  //Get Account Data
  const accountStatus = useSelector(
    (state) => state.accessControl.getAccountSettingsStatus
  );

  const account = useSelector(
    (state) => state.accessControl.getAccountSettings
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process?.env?.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: placesLibrary,
  });

  const [autocompleteRef, setAutocompleteRef] = useState();

  const isLoading = accountStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getAccountSettings(params));
  }, [session, status]);

  function clearForm() {
    setName("");
    setPhone("");
    setEmail("");
    setLocation("");
    setFacebook("");
    setInstagram("");
    setTwitter("");
    setWebsite("");
    //
    setTiktok("");
    setThreads("");
    setKraPin("");
  }

  useEffect(() => {
    if (!account) {
      return;
    }
    //Set Default Params
    setName(account?.name);
    setPhone(account?.phone);
    setEmail(account?.email);
    setLocation(account?.location);
    setFacebook(account?.facebook_page);
    setInstagram(account?.instagram_page);
    setTwitter(account?.twitter_page);
    setWebsite(account?.website);
    //
    setTiktok(account?.tiktok_page);
    setThreads(account?.threads_page);
    setKraPin(account?.kra_pin);
    //privacy_code
    setPrivacyCode(account?.privacy_code);
    //images
    setCoverPhoto(account?.cover_photo);
    setProfilePhoto(account?.profile_photo);
  }, [account]);

  const saveProfileInfo = async (event) => {
    event.preventDefault();

    const data = {
      name: name,
      email: email,
      phone: phone,
      gender: "",
      location: location,
      website: website,
      facebook_page: facebook,
      instagram_page: instagram,
      twitter_page: twitter,
      tiktok_page: tiktok,
      threads_page: threads,
      kra_pin: kraPin,
      linkedin_page: "",
    };

    console.log("Payload", data);

    const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/settings/update/profile-info`;

    const accessToken = session.user.accessToken;

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "PATCH",
      // Tell the server we're sending JSON.
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    };

    setLoading(true);
    const response = await fetch(endpoint, options);
    const result = await response.json();

    console.log("Api Response", result);
    console.log("Api Response 2", response);

    if (!result.error && !result.errors) {
      showNotification({
        title: "Success",
        message: result.message,
        color: "green",
      });
      clearForm();
      setLoading(false);
      const params = {};
      params["accessToken"] = session.user.accessToken;
      store.dispatch(getAccountSettings(params));
    } else {
      if (result.error) {
        showNotification({
          title: "Error",
          message: "Error ): " + result.error,
          color: "red",
        });
      } else {
        // error occurred
        let message = "";
        for (let field in result.errors) {
          message += result.errors[field][0] + ", ";
        }
        message = message.slice(0, -2); // remove last comma and space
        showNotification({
          title: "Error",
          message: message,
          color: "red",
        });
      }
      setLoading(false);
    }
    setLoading(false);
  };

  const savePrivacyCode = async (event) => {
    event.preventDefault();

    const data = {
      privacy_code: privacyCode,
    };

    console.log("Payload", data);

    const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/settings/change-privacy-code`;

    const accessToken = session.user.accessToken;

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "PATCH",
      // Tell the server we're sending JSON.
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    };

    setLoadingPrivacyCode(true);
    const response = await fetch(endpoint, options);
    const result = await response.json();

    console.log("Api Response", result);

    if (!result.error) {
      showNotification({
        title: "Success",
        message: result.message,
        color: "green",
      });
      setLoadingPrivacyCode(false);
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.message,
        color: "red",
      });
      setLoadingPrivacyCode(false);
    }
    setLoadingPrivacyCode(false);
  };

  const savePassword = async (event) => {
    event.preventDefault();

    //password change

    var urlencoded = new URLSearchParams();
    urlencoded.append("current_password", currentPassword);
    urlencoded.append("password", newPassword);
    urlencoded.append("password_confirmation", confirmPassword);

    // const data = {
    //   current_password: currentPassword,
    //   password: newPassword,
    //   confirm_password: confirmPassword,
    // };

    // console.log("Payload", data);

    // const JSONdata = JSON.stringify(data);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/settings/change-password`;

    const accessToken = session.user.accessToken;

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "PATCH",
      // Tell the server we're sending JSON.
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // "Content-Type": "application/json",
        Accept: "application/json",
      },
      // Body of the request is the JSON data we created above.
      body: urlencoded,
    };

    setLoadingPassword(true);
    const response = await fetch(endpoint, options);
    const result = await response.json();

    console.log("Api Response", result);

    if (result.statusCode != 201 && !result.error) {
      showNotification({
        title: "Success",
        message: "Password updated Successfully",
        color: "green",
      });
      //Reset Values
      setLoadingPassword(false);
    } else {
      if (result.error) {
        showNotification({
          title: "Error",
          message: "Error ): " + result.error,
          color: "red",
        });
      } else {
        // error occurred
        let message = "";
        for (let field in result.errors) {
          message += result.errors[field][0] + ", ";
        }
        message = message.slice(0, -2); // remove last comma and space
        showNotification({
          title: "Error",
          message: message + response?.statusText,
          color: "red",
        });
      }
      setLoadingPassword(false);
    }
  };

  const handleFileChange = (event) => {
    const input = event.target;
    if (input && input.files && input.files.length > 0) {
      setCoverPhoto(input.files[0]);

      const url = URL.createObjectURL(input.files[0]);
      setPreviewCoverUrl(url);
    }
  };

  //handleProfileChange
  const handleProfileChange = (event) => {
    const input = event.target;
    if (input && input.files && input.files.length > 0) {
      setProfilePhoto(input.files[0]);

      //
      const url = URL.createObjectURL(input.files[0]);
      setPreviewUrl(url);
    }
  };

  const uploadCoverPhoto = async (event) => {
    event.preventDefault();

    if (!coverPhoto) {
      showNotification({
        title: "Error",
        message: "Error ): A cover photo is required!",
        color: "red",
      });
      return;
    }

    if (coverPhoto.size > 1000000) {
      // 1MB limit
      showNotification({
        title: "Error",
        message: "Error ): Cover photo size must be less than 1MB!",
        color: "red",
      });
      return;
    }

    const formData = new FormData();
    formData.append("cover_photo", coverPhoto);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/settings/upload-cover-photo`;

    const accessToken = session.user.accessToken;

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "POST",
      // Tell the server we're sending JSON.
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // "Content-Type": "application/json",
        Accept: "application/json",
      },
      // Body of the request is the JSON data we created above.
      body: formData,
    };

    setLoadingCoverPhoto(true);
    const response = await fetch(endpoint, options);
    const result = await response.json();

    // Add a 5-second delay
    setTimeout(() => {
      console.log("Api Response", result);

      if (result.statusCode != 201 && response.status === 200) {
        showNotification({
          title: "Success",
          message: "Cover photo uploaded Successfully",
          color: "green",
        });
        //Reset Values
        setLoadingCoverPhoto(false);
      } else {
        if (result.error) {
          showNotification({
            title: "Error",
            message: "Error ): " + result.error,
            color: "red",
          });
        } else {
          // error occurred
          let message = "";
          for (let field in result.errors) {
            message += result.errors[field][0] + ", ";
          }
          message = message.slice(0, -2); // remove last comma and space
          showNotification({
            title: "Error",
            message: message + response?.statusText,
            color: "red",
          });
        }
        setLoadingCoverPhoto(false);
      }
    }, 5000); // Delay of 5 seconds
  };

  const uploadProfilePhoto = async (event) => {
    event.preventDefault();

    if (!profilePhoto) {
      showNotification({
        title: "Error",
        message: "Error ): A profile photo is required!",
        color: "red",
      });
      return;
    }

    if (profilePhoto.size > 1000000) {
      // 1MB limit
      showNotification({
        title: "Error",
        message: "Error ): Profile photo size must be less than 1MB!",
        color: "red",
      });
      return;
    }

    const formData = new FormData();
    formData.append("profile_photo", profilePhoto);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/settings/upload-profile-photo`;

    const accessToken = session.user.accessToken;

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "POST",
      // Tell the server we're sending JSON.
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // "Content-Type": "application/json",
        Accept: "application/json",
      },
      // Body of the request is the JSON data we created above.
      body: formData,
    };

    setLoadingProfilePhoto(true);
    const response = await fetch(endpoint, options);
    const result = await response.json();

    // Add a 5-second delay
    setTimeout(() => {
      console.log("Api Response", result);

      if (result.statusCode != 201 && response.status === 200) {
        showNotification({
          title: "Success",
          message: "Profile photo uploaded Successfully",
          color: "green",
        });
        //Reset Values
        setLoadingProfilePhoto(false);
      } else {
        if (result.error) {
          showNotification({
            title: "Error",
            message: "Error ): " + result.error,
            color: "red",
          });
        } else {
          // error occurred
          let message = "";
          for (let field in result.errors) {
            message += result.errors[field][0] + ", ";
          }
          message = message.slice(0, -2); // remove last comma and space
          showNotification({
            title: "Error",
            message: message + response?.statusText,
            color: "red",
          });
        }
        setLoadingProfilePhoto(false);
      }
    }, 5000); // Delay of 5 seconds
  };

  return (
    <section className="bg-white ">
      <div className="container mx-auto  items-center flex-wrap  pb-12">
        <article>
          {/* Profile header */}
          <div>
            <div>
              {previewCoverUrl ? (
                <Image
                  className="h-32 w-full object-cover lg:h-48"
                  src={previewCoverUrl}
                  alt="Cover Photo"
                  width={1900}
                  height={300}
                />
              ) : (
                coverPhoto && (
                  <Image
                    className="h-32 w-full object-cover lg:h-48"
                    src={`${coverPhoto}`}
                    alt="Cover Photo"
                    width={1900}
                    height={300}
                  />
                )
              )}
            </div>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                <div className="flex">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      className="inline-block h-14 w-14 rounded-full"
                      alt="Profile Photo Preview"
                      width={50}
                      height={50}
                    />
                  ) : (
                    profilePhoto && (
                      <Image
                        src={`${profilePhoto}`}
                        className="inline-block h-14 w-14 rounded-full"
                        alt="Profile Photo"
                        width={50}
                        height={50}
                      />
                    )
                  )}
                </div>
                <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                  <div className="sm:hidden 2xl:block mt-6 min-w-0 flex-1">
                    <h1 className="text-2xl font-bold  mt-2 text-gray-900 truncate">
                      {session?.user?.name}
                    </h1>
                  </div>
                </div>
              </div>
              <div className="hidden sm:block 2xl:hidden mt-6 min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-gray-900 truncate">
                  {session?.user?.name}
                </h1>
              </div>
            </div>
          </div>
          {/* Tabs */}
          <div className="mt-6 sm:mt-2 2xl:mt-5">
            <div className="border-b border-gray-200">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <a
                    href="#"
                    className="border-black text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                  >
                    Update
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </article>
        <div className="w-full mx-auto py-6 sm:px-6 lg:px-8">
          <div>
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <div className="px-4 sm:px-0">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Profile
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    This information will be displayed publicly so be careful
                    what you share.
                  </p>
                  <p className="mt-1 text-sm text-red-600">
                    Make sure your image sizes are 400px Height X 700px Width to
                    fit well on the marketplace without stretching!
                  </p>
                </div>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Photo
                      </label>
                      <div className="mt-1 flex items-center">
                        {previewUrl ? (
                          <Image
                            src={previewUrl}
                            className="inline-block h-14 w-14 rounded-full"
                            alt="Profile Photo Preview"
                            width={50}
                            height={50}
                          />
                        ) : (
                          profilePhoto && (
                            <Image
                              src={`${profilePhoto}`}
                              className="inline-block h-14 w-14 rounded-full"
                              alt="Profile Photo"
                              width={50}
                              height={50}
                            />
                          )
                        )}
                        <label
                          htmlFor="file-upload"
                          className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                        >
                          <span>Change</span>
                          <input
                            id="file-upload"
                            name="profile_photo"
                            type="file"
                            className="sr-only"
                            onChange={handleProfileChange}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3  text-right sm:px-6">
                    <Button
                      variant="outline"
                      onClick={uploadProfilePhoto}
                      loading={loadingProfilePhoto}
                    >
                      Upload Photo
                    </Button>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 m-3">
                    <label
                      htmlFor="cover-photo"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Cover photo
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <span>Upload Cover Photo</span>
                          <input
                            id="file-upload"
                            name="cover_photo"
                            type="file"
                            className="form-control"
                            onChange={handleFileChange}
                          />
                          <p className="text-xs text-gray-500">
                            PNG, JPG up to 4MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 text-right sm:px-6">
                    <Button
                      variant="outline"
                      onClick={uploadCoverPhoto}
                      loading={loadingCoverPhoto}
                    >
                      Upload Cover
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden sm:block" aria-hidden="true">
            <div className="py-5">
              <div className="border-t border-gray-200" />
            </div>
          </div>
          <div className="mt-10 sm:mt-0">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <div className="px-4 sm:px-0">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Profile Information
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Use your official details.
                  </p>
                </div>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="shadow overflow-hidden sm:rounded-md mantine">
                  <div className="px-4 py-5 bg-white sm:p-6">
                    <section className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
                      <TextInput
                        label="Name"
                        placeholder="Enter your name"
                        required
                        value={name}
                        onChange={(event) => setName(event.currentTarget.value)}
                        style={{ width: "100%" }}
                      />
                      <TextInput
                        label="Phone Number"
                        type="tel"
                        placeholder="Enter your phone number"
                        required
                        value={phone}
                        onChange={(event) =>
                          setPhone(event.currentTarget.value)
                        }
                        style={{ width: "100%" }}
                      />
                      <TextInput
                        label="Email address"
                        placeholder="Enter your email"
                        required
                        value={email}
                        onChange={(event) =>
                          setEmail(event.currentTarget.value)
                        }
                        style={{ width: "100%" }}
                      />
                      {/* <TextInput
                        label="Location"
                        placeholder="Enter your location"
                        style={{ width: "100%" }}
                        value={location}
                        onChange={(event) =>
                          setLocation(event.currentTarget.value)
                        }
                      /> */}
                      {isLoaded && (
                        <Autocomplete
                          onPlaceChanged={() => {
                            setLocation(
                              autocompleteRef?.getPlace()?.formatted_address
                            );
                          }}
                          onLoad={(autocomplete) => {
                            setAutocompleteRef(autocomplete);
                          }}
                        >
                          <TextInput
                            label="Location"
                            placeholder="Location"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                          />
                        </Autocomplete>
                      )}
                      <TextInput
                        label="Facebook Profile"
                        placeholder="Enter your Facebook profile URL"
                        style={{ width: "100%" }}
                        value={facebook}
                        onChange={(event) =>
                          setFacebook(event.currentTarget.value)
                        }
                      />
                      <TextInput
                        label="Instagram Profile"
                        placeholder="Enter your Instagram profile URL"
                        style={{ width: "100%" }}
                        value={instagram}
                        onChange={(event) =>
                          setInstagram(event.currentTarget.value)
                        }
                      />
                      <TextInput
                        label="Twitter Profile"
                        placeholder="Enter your Twitter profile URL"
                        style={{ width: "100%" }}
                        value={twitter}
                        onChange={(event) =>
                          setTwitter(event.currentTarget.value)
                        }
                      />
                      <TextInput
                        label="Website"
                        placeholder="Enter your Website URL"
                        style={{ width: "100%" }}
                        value={website}
                        onChange={(event) =>
                          setWebsite(event.currentTarget.value)
                        }
                      />
                      <TextInput
                        label="Tiktok Page"
                        placeholder="Enter your Tiktok page URL"
                        style={{ width: "100%" }}
                        value={tiktok}
                        onChange={(event) =>
                          setTiktok(event.currentTarget.value)
                        }
                      />
                      <TextInput
                        label="Threads Page"
                        placeholder="Enter your Threads page URL"
                        style={{ width: "100%" }}
                        value={threads}
                        onChange={(event) =>
                          setThreads(event.currentTarget.value)
                        }
                      />
                      <TextInput
                        label="KRA Pin"
                        placeholder="Set KRA Pin"
                        style={{ width: "100%" }}
                        value={kraPin}
                        onChange={(e) => setKraPin(e.target.value)}
                      />
                    </section>
                  </div>
                  <div className="px-4 py-3 text-right sm:px-6">
                    <Button
                      variant="outline"
                      onClick={saveProfileInfo}
                      loading={loading}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="hidden sm:block" aria-hidden="true">
            <div className="py-5">
              <div className="border-t border-gray-200" />
            </div>
          </div>
          <div className="mt-10 sm:mt-0">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <div className="px-4 sm:px-0">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Privacy
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Privacy Code Management
                  </p>
                </div>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 bg-white sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-6">
                        <TextInput
                          label="Privacy Code"
                          placeholder="Enter privacy code"
                          value={privacyCode}
                          required
                          onChange={(event) =>
                            setPrivacyCode(event.currentTarget.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3  text-right sm:px-6">
                    <Button
                      variant="outline"
                      color="black"
                      onClick={savePrivacyCode}
                      loading={loadingPrivacyCode}
                    >
                      Set
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          <div className="hidden sm:block" aria-hidden="true">
            <div className="py-5">
              <div className="border-t border-gray-200" />
            </div>
          </div>
          <div className="mt-10 sm:mt-0">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <div className="px-4 sm:px-0">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Security
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Password Management
                  </p>
                </div>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 bg-white sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-6">
                        <TextInput
                          label="Current Password"
                          placeholder="Current Password"
                          type="password"
                          value={currentPassword}
                          onChange={(event) =>
                            setCurrentPassword(event.currentTarget.value)
                          }
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <TextInput
                          label="New Password"
                          placeholder="New Password"
                          type="password"
                          value={newPassword}
                          onChange={(event) =>
                            setNewPassword(event.currentTarget.value)
                          }
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <TextInput
                          label="Confirm New Password"
                          placeholder="Confirm New Password"
                          type="password"
                          value={confirmPassword}
                          onChange={(event) =>
                            setConfirmPassword(event.currentTarget.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3  text-right sm:px-6">
                    <Button
                      variant="outline"
                      onClick={savePassword}
                      loading={loadingPassword}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AccountSettings;
