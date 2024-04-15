import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import getLogger from "@/lib/shared/logger";

const logger = getLogger("RequisitionSlice");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  requistionList: null,
  manufactured_product_id:null,
  selected_recipe_id:null,
  selected_req_id:null,
  selected_service_requisiton:null,
  redirect_to_req:false,
  manu_products:null,
  requisitionData: null,
  requistionListStatus: "idle",
  submitRequisitionStatus: "idle",
  updateRequisitionStatus: "idle",
  fetchRequisitionList: [],
  fetchRequisitionListStatus: "idle",
  EditSubmissionStatus: "idle",
  confirmRequestStatus:"idle",
  receiveRequestStatus:"idle",
  variation_vals:[],
  selected_index:null,
  getReqProductsPDFStatus:"idle",
  getAllReqProductsPDFStatus:"idle",
  getAllReqProductsPDF:null,
  getReqProductsPDF:null,
  manuProductsStatus:"idle",
  existingReq:null,
  existingReqStatus:"idle",
  deleteRequisitionStatus: "idle",
};


export const fetchRequisitionList = createAsyncThunk(
    "requisition/fetchRequisitionList",
    async ({ accessToken = null,startDate = null,
      endDate = null,filter=null,select_staff=null } = {}) => {
      if (!accessToken) {
        return;
      }
      let url = `${API_URL}/requisitions?`;

      const params = {};

      if (startDate) {
        params["start_date"] = startDate;
      }
      if (endDate) {
        params["end_date"] = endDate;
      }

      if (filter) {
        params["filter"] = filter;
      }

       if(select_staff)
       {
        params["select_staff"] = select_staff;
       }


      url += new URLSearchParams(params);


      const startTime = new Date();
      logger.log("fetchRequisitionList::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("fetchRequisitionList::END", { took: seconds, data });

        if (!response.ok) {
          throw data;
        }

        return data;
      });

      return response;
    }
  );

  //Fetch Manufactured Products
export const fetchManuProducts = createAsyncThunk(
  "requisition/fetchManuProducts",
  async ({
    accessToken = null,
    search_string = null,
    page = null,
    branch_id = null,
    detailed = false,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/manu-products?`;
    }

    const params = {};

    if (search_string) {
      params["search_string"] = search_string;
    }
    if (detailed) {
      params["detailed"] = true;
    }
    if (branch_id) {
      params["branch_id"] = branch_id;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchManuProducts::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchManuProducts:::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//remove requisition
export const deleteRequisition = createAsyncThunk(
  "requisition/removeRequisition",
  async ({ accessToken = null, itemId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/requisitions/${itemId}`;

    const startTime = new Date();
    logger.log("deleteRequisition::BEGIN");
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("deleteRequisition::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);


  export const submitRequisition = createAsyncThunk(
    "requisitions/submitRequisition",
    async ({ accessToken = null,
        product_reqs = null,req_comments=null,
        requisition_date=null
     } = {}) => {
      if (!accessToken) {
        return;
      }

      let url = `${API_URL}/requisitions`;
      let body = {};
      body["req_comments"] = req_comments;
      body["product_reqs"] = product_reqs;
      body["requisition_date"] = requisition_date;


      body = JSON.stringify(body);

      const startTime = new Date();
      logger.log("submitRequisition::BEGIN", body);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken} `,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body,
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("submitRequisition::END", { took: seconds, data });

        if (!response.ok) {
          throw data;
        }

        return data;
      });

      return response;
    }
  );

  //Fetch Existing Requisition
export const fetchExistingRequisition = createAsyncThunk(
  "requisitions/fetchExistingRequisition",
  async ({
    accessToken = null,
    req_id=null,
    page=null
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/existing-req?`;
    }
    // console.log("Here Is The Data");
    const params = {};


    params["req_id"] = req_id;


    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchExistingRequisition::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchExistingRequisition:::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

  export const submitEditReq = createAsyncThunk(
    "requisitions/submitEditReq",
    async ({
      accessToken = null,
       staff_id = null,
        product_components = null,req_comments=null,
        requisition_date=null,productId=null,
        all_cost=null,req_id=null,
        quantity_to_manufacture=null,recipe_id=null
    } = {}) => {
      if (!accessToken) {
        return;
      }

      let url = `${API_URL}/requisitions/${req_id}`;
      let body = {};

      body["staff_id"] = staff_id;
      body["req_comments"] = req_comments;
      body["productId"] = productId;
      body["requisition_date"] = requisition_date;
      body["product_components"] = product_components;
      body["all_cost"] = all_cost;
      body['quantity_to_manufacture'] = quantity_to_manufacture;
      body['recipe_id'] = recipe_id;


      body = JSON.stringify(body);

      const startTime = new Date();
      logger.log("submitEditReq::BEGIN", body);
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken} `,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body,
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("submitEditReq::END", { took: seconds, data });

        if (!response.ok) {
          throw data;
        }

        return data;
      });

      return response;
    }
  );
  //Confirm Requset
export const confirmRequest = createAsyncThunk(
  "requisitions/confirmRequest",
  async ({
    page = null,
    accessToken = null,
    req_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/update-requisition-line?`;
    }

    const params = {};
    params["req_id"] = req_id;



    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("confirmRequest::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("confirmRequest::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Receive Request
export const receiveRequest = createAsyncThunk(
  "requisitions/receiveRequest",
  async ({
    page = null,
    accessToken = null,
    req_id = null,
    receival_comments=null,
    req_components=[]
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/receive-requisition-line?`;
    }

    const params = {};
    params["req_id"] = req_id;
    params["receival_comments"] = receival_comments;
    params["req_components"] = JSON.stringify(req_components)


    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("receiveRequest::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("receiveRequest::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getReqProductsPDF = createAsyncThunk(
  "products/getReqProductsPDF",
  async ({ page = null, accessToken = null, req_id = null,filter=null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/download-req-pdf?`;
    }

    const params = {};
    if (req_id) {
      params["req_id"] = req_id;
    }

    if (filter) {
      params["filter"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getReqProductsPDF::BEGIN");
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.blob();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getReqProductsPDF::END", { took: seconds });

      if (!response.ok) {
        throw { message: "failure" };
      }

      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.innerHTML = `Requisition.pdf`;
      a.target = "_blank";
      a.click();

      return { message: "success" };
    });

    return response;
  }
);

export const getAllReqProductsPDF = createAsyncThunk(
  "products/getAllReqProductsPDF",
  async ({ page = null, accessToken = null, req_id = null,filter=null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/download-all-req-pdf?`;
    }

    const params = {};
    if (req_id) {
      params["req_id"] = req_id;
    }

    if (filter) {
      params["filter"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getAllReqProductsPDF::BEGIN");
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.blob();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getAllReqProductsPDF::END", { took: seconds });

      if (!response.ok) {
        throw { message: "failure" };
      }

      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.innerHTML = `Requisition.pdf`;
      a.target = "_blank";
      a.click();

      return { message: "success" };
    });

    return response;
  }
);

  const requisition = createSlice({
    name: "requisition",
    initialState,
    reducers: {
      setVals(state, action) {
        const { vals } = action.payload;
        console.log(vals);
        state.variation_vals.push(vals);
      },
      setMultipleVals(state, action) {
        const { vals } = action.payload;
        state.variation_vals = vals;
        console.log("Random", vals);
      },
      setValsName(state, action) {
        const { values } = action.payload;

        const newValues = [...state.variation_vals];
        newValues[state.selected_index]["name"] = values;
        state.variation_vals = newValues;
      },
      setBillOfMaterial(state, action) {
        const { bill_id } = action.payload;
        console.log("the selected bill is " + bill_id);
        state.selected_recipe_id = bill_id;
      },
      setManufacturedProduct(state, action) {
        const { product_id } = action.payload;
        console.log("the selected is " + product_id);
        state.manufactured_product_id = product_id;
      },
      setRequisition(state, action)
      {
        const { req_id } = action.payload;
        state.selected_req_id = req_id;
      },
      setRequisitionService(state,action)
      {
        const {service_id} = action.payload;
        state.selected_service_requisiton = service_id;
      },
      setRedirectToReq(state,action)
      {
        const {status} =  action.payload;
        console.log("The main status is " + status);
         state.redirect_to_req= status;


         console.log("The next status  " + state.redirect_to_req);

      }
      ,
      clearRequisition(state)
      {
        state.selected_req_id=null;
      },
      clearManufacturedId(state)
      {
        state.manufactured_product_id=null;
      },
      clearReqService(state)
      {
        state.selected_service_requisiton=null;
      }
    },
    extraReducers(builder) {
      builder
        // submitRequisitionData
        .addCase(submitRequisition.pending, (state) => {
          state.submitRequisitionStatus = "loading";
        })
        .addCase(submitRequisition.rejected, (state, action) => {
          state.submitRequisitionStatus = "rejected";
          logger.warn("submitRequisition::REJECTED", action.error);
        })
        .addCase(submitRequisition.fulfilled, (state, action) => {
          const { payload } = action;
          logger.log("submitRequisition::FULFILLED", { payload });

          state.submitRequisitionStatus = "fulfilled";
        })



        //fetchRequisitionList
        .addCase(fetchRequisitionList.pending, (state) => {
          state.fetchRequisitionListStatus = "loading";
        })
        .addCase(fetchRequisitionList.rejected, (state, action) => {
          state.fetchRequisitionListStatus = "rejected";
          logger.warn("fetchRequisitionList::REJECTED", action.error);
        })
        .addCase(fetchRequisitionList.fulfilled, (state, action) => {
          const { payload } = action;
          logger.log("fetchRequisitionList::FULFILLED", { payload });

          state.fetchRequisitionListStatus = "fulfilled";
          state.requistionList = action.payload;

        })

        //fetch Existing Requistions
        .addCase(fetchExistingRequisition.pending, (state) => {
          state.existingReqStatus = "loading";
        })
        .addCase(fetchExistingRequisition.rejected, (state, action) => {
          state.existingReqStatus = "rejected";
          logger.log("fetchExistingRequisition::REJECTED", action.error);
        })
        .addCase(fetchExistingRequisition.fulfilled, (state, action) => {
          const { payload } = action;
          logger.log("fetchExistingRequisition::FULFILLED", { payload });

          state.existingReqStatus = "fulfilled";

          const reqs = action.payload;
          state.existingReq = reqs;
        })

        //
      .addCase(fetchManuProducts.pending, (state) => {
        state.manuProductsStatus = "loading";
      })
      .addCase(fetchManuProducts.rejected, (state, action) => {
        state.manuProductsStatus = "rejected";
        logger.log("fetchManuProducts::REJECTED", action.error);
      })
      .addCase(fetchManuProducts.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchManuProducts::FULFILLED", { payload });

        state.manuProductsStatus = "fulfilled";
        state.manu_products = action.payload;
      })

      //confirm Request
      .addCase(confirmRequest.pending, (state) => {
        state.confirmRequestStatus = "loading";
      })
      .addCase(confirmRequest.rejected, (state) => {
        state.confirmRequestStatus = "rejected";
        logger.log("confirmRequest::REJECTED");
      })
      .addCase(confirmRequest.fulfilled, (state, action) => {
        state.confirmRequestStatus = "fulfilled";

      })

       //receive Request
       .addCase(receiveRequest.pending, (state) => {
        state.receiveRequestStatus = "loading";
      })
      .addCase(receiveRequest.rejected, (state) => {
        state.receiveRequestStatus = "rejected";
        logger.log("receiveRequest::REJECTED");
      })
      .addCase(receiveRequest.fulfilled, (state, action) => {
        state.receiveRequestStatus = "fulfilled";
      })

      // submitEditReq
      .addCase(submitEditReq.pending, (state) => {
        state.EditSubmissionStatus = "loading";
      })
      .addCase(submitEditReq.rejected, (state, action) => {
        state.EditSubmissionStatus = "rejected";
        logger.warn("submitEditReq::REJECTED", action.error);
      })
      .addCase(submitEditReq.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitEditReq::FULFILLED", { payload });

        state.EditSubmissionStatus = "fulfilled";
      })

         // PDF Data
         .addCase(getReqProductsPDF.pending, (state) => {
          state.getReqProductsPDFStatus = "loading";
        })
        .addCase(getReqProductsPDF.rejected, (state) => {
          state.getReqProductsPDFStatus = "rejected";
          logger.log("getReqProductsPDFStatus::REJECTED");
        })
        .addCase(getReqProductsPDF.fulfilled, (state, action) => {
          state.getReqProductsPDFStatus = "fulfilled";
          state.getReqProductsPDF = action.payload;
        })

         // PDF Data
         .addCase(getAllReqProductsPDF.pending, (state) => {
          state.getAllReqProductsPDFStatus = "loading";
        })
        .addCase(getAllReqProductsPDF.rejected, (state) => {
          state.getAllReqProductsPDFStatus = "rejected";
          logger.log("getAllReqProductsPDFStatus::REJECTED");
        })
        .addCase(getAllReqProductsPDF.fulfilled, (state, action) => {
          state.getAllReqProductsPDFStatus = "fulfilled";
          state.getAllReqProductsPDF = action.payload;
        })

         // deleteRequisition
      .addCase(deleteRequisition.pending, (state) => {
        state.deleteRequisitionStatus = "loading";
      })
      .addCase(deleteRequisition.rejected, (state, action) => {
        state.deleteRequisitionStatus = "rejected";
        logger.warn("deleteRequisition::REJECTED", action.error);
      })
      .addCase(deleteRequisition.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("deleteRequisition::FULFILLED");

        state.deleteRequisitionStatus = "fulfilled";
      })

      // END
    },
  });

  export const {setManufacturedProduct,setBillOfMaterial,setRequisition,setRequisitionService,setRedirectToReq,clearRequisition,clearManufacturedId,clearReqService} = requisition.actions;


  export default requisition.reducer;
