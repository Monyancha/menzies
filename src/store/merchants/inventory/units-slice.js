import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../../lib/shared/logger";

const logger = getLogger("Units");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
    unitFamiliesList:null,
    unitFamiliesListStatus:"idle",

    unitList:null,
    unitListStatus:"idle",

    allowanceList:null,
    allowanceListStatus:"idle",

    unitFamiliesSubmissionStatus:"idle",
    unitSubmissionStatus:"idle",
    allowanceSubmissionStatus:"idle",
    unitEditStatus:"idle",
    deleteUnitStatus:"idle"

}

export const fetchUnitFamilies = createAsyncThunk(
    "unitSlice/fetchUnitFamilies",
    async ({
      page = null,
      accessToken = null,
      filter = null,
      detailed = false,
    } = {}) => {
      if (!accessToken) {
        return;
      }
      let url = undefined;
      if (page) {
        url = page + "&";
      } else {
        url = `${API_URL}/unit-families?`;
      }
      const params = {};
  
      if (filter) {
        params["filter"] = filter;
      }
      if (detailed) {
        params["detailed"] = true;
      }
      url += new URLSearchParams(params);
  
      const startTime = new Date();
      logger.log("fetchUnitFamilies::BEGIN");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken} `,
          Accept: "application/json",
        },
      }).then(async (response) => {
        const data = await response.json();
        const endTime = new Date();
        const seconds = endTime.getTime() - startTime.getTime();
        logger.log("fetchUnitFamilies::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );

export const fetchUnits = createAsyncThunk(
    "unitSlice/fetchUnits",
    async ({
        page = null,
        accessToken = null,
        filter = null
    } = {}) => {
        if(!accessToken)
        {
            return;
        }

        let url = undefined;

        if(page)
        {
            url = page + "&";
        }
        else{
            url = `${API_URL}/units?`;
        }

        const params = {}
        if(filter)
        {
            params["filter"] = filter;
        }

        url += new URLSearchParams(params);

        const startTime = new Date();
        logger.log("fetchUnits::BEGIN");
        const response = await fetch(url,{
            headers: {
                Authorization:`Bearer ${accessToken}`,
                Accept:"application/json"
            },
        }).then(async (response) => {
            const data = await response.json();
            const endTime = new Date();
            const seconds = endTime.getTime() - startTime.getTime();
            logger.log("fetchUnits::END", {took:seconds,data});

            if(!response.ok)
            {
                throw data;
            }

            return data;
        });
        return response;
    }
);

export const fetchAllAllowances = createAsyncThunk(
  "unitSlice/fetchAllAllowances",
  async ({
      page = null,
      accessToken = null,
      filter = null
  } = {}) => {
      if(!accessToken)
      {
          return;
      }

      let url = undefined;

      if(page)
      {
          url = page + "&";
      }
      else{
          url = `${API_URL}/allowances-list?`;
      }

      const params = {}
      if(filter)
      {
          params["filter"] = filter;
      }

      url += new URLSearchParams(params);

      const startTime = new Date();
      logger.log("fetchAllAllowances::BEGIN");
      const response = await fetch(url,{
          headers: {
              Authorization:`Bearer ${accessToken}`,
              Accept:"application/json"
          },
      }).then(async (response) => {
          const data = await response.json();
          const endTime = new Date();
          const seconds = endTime.getTime() - startTime.getTime();
          logger.log("fetchAllAllowances::END", {took:seconds,data});

          if(!response.ok)
          {
              throw data;
          }

          return data;
      });
      return response;
  }
);


export const submitUnitFamilies = createAsyncThunk(
    "unitSlice/submitUnitFamilies",
    async ({
        accessToken = null,
        name = null,
        description = null,
    } ={}) => {
        if(!accessToken)
        {
            return;
        }

        let url = `${API_URL}/unit-families`;
        let body = {};
        
        body["name"] = name;
        body["description"] = description;

        body = JSON.stringify(body);

        const startTime = new Date();
        logger.log("submitUnitFamilies::BEGIN",body);

        const response = await fetch(url,{
            method:"POST",
            headers:{
                Authorization:`Bearer ${accessToken}`,
                "Content-Type":"application/json",
                Accept:"application/json"
            },
            body
        }).then(async (response) => {
            const data = await response.json();
            const endTime = new Date();
            const seconds = endTime.getTime() - startTime.getTime();
            logger.log("submitUnitFamilies::END",{took:seconds,data});
            if(!response.ok)
            {
                throw data;
            }

            return data;
        })
    }
)

export const submitNewAllowance = createAsyncThunk(
  "unitSlice/submitNewAllowance",
  async ({
      accessToken = null,
      name = null,
  } ={}) => {
      if(!accessToken)
      {
          return;
      }

      let url = `${API_URL}/new-allowance`;
      let body = {};
      
      body["name"] = name;
     

      body = JSON.stringify(body);

      const startTime = new Date();
      logger.log("submitNewAllowance::BEGIN",body);

      const response = await fetch(url,{
          method:"POST",
          headers:{
              Authorization:`Bearer ${accessToken}`,
              "Content-Type":"application/json",
              Accept:"application/json"
          },
          body
      }).then(async (response) => {
          const data = await response.json();
          const endTime = new Date();
          const seconds = endTime.getTime() - startTime.getTime();
          logger.log("submitNewAllowance::END",{took:seconds,data});
          if(!response.ok)
          {
              throw data;
          }

          return data;
      })
  }
)

export const submitUnit = createAsyncThunk(
    "unitSlice/submitUnit",
    async ({
        accessToken = null,
        name = null,
        description = null,
        unit_family_id = null
    } ={}) => {
        if(!accessToken)
        {
            return;
        }

        let url = `${API_URL}/units`;
        let body = {};
        
        body["name"] = name;
        body["description"] = description;
        body["unit_family_id"] = unit_family_id;

        body = JSON.stringify(body);

        const startTime = new Date();
        logger.log("submitUnit::BEGIN",body);

        const response = await fetch(url,{
            method:"POST",
            headers:{
                Authorization:`Bearer ${accessToken}`,
                "Content-Type":"application/json",
                Accept:"application/json"
            },
            body
        }).then(async (response) => {
            const data = await response.json();
            const endTime = new Date();
            const seconds = endTime.getTime() - startTime.getTime();
            logger.log("submitUnit::END",{took:seconds,data});
            if(!response.ok)
            {
                throw data;
            }

            return data;
        })
    }
)

export const deleteUnit = createAsyncThunk(
    "BranchesSlice/deleteUnit",
    async ({ accessToken = null, itemId = null } = {}) => {
      if (!accessToken) {
        return;
      }
  
      let url = `${API_URL}/units/${itemId}`;
  
      const startTime = new Date();
      logger.log("deleteUnit::BEGIN");
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
        logger.log("deleteUnit::END", { took: seconds, data });
  
        if (!response.ok) {
          throw data;
        }
  
        return data;
      });
  
      return response;
    }
  );


export const submitUnitEdit = createAsyncThunk(
    "unitSlice/submitUnitEdit",
    async ({
        accessToken = null,
        name = null,
        id=null,
        unit_family_id = null
    } ={}) => {
        if(!accessToken)
        {
            return;
        }

        let url = `${API_URL}/units/${id}`;
        let body = {};
        
        body["name"] = name;
       
        body["unit_family_id"] = unit_family_id;

        body = JSON.stringify(body);

        const startTime = new Date();
        logger.log("submitUnitEdit::BEGIN",body);

        const response = await fetch(url,{
            method: "PUT",
            headers:{
                Authorization:`Bearer ${accessToken}`,
                "Content-Type":"application/json",
                Accept:"application/json"
            },
            body
        }).then(async (response) => {
            const data = await response.json();
            const endTime = new Date();
            const seconds = endTime.getTime() - startTime.getTime();
            logger.log("submitUnitEdit::END",{took:seconds,data});
            if(!response.ok)
            {
                throw data;
            }

            return data;
        })
    }
)

const unitSlice = createSlice({
    name:"units",
    initialState,
    reducers:{},
    extraReducers(builder) {
        builder
        //fetch unit families
        .addCase(fetchUnitFamilies.pending, (state) => {
            state.unitFamiliesListStatus = "loading";
        })
        .addCase(fetchUnitFamilies.rejected,(state) => {
            state.unitFamiliesListStatus = "rejected";
            logger.log("fetchUnitFamilies::REJECTED");
        })
        .addCase(fetchUnitFamilies.fulfilled,(state,action) => {
           const { payload } = action;
           logger.log("fetchUnitFamilies::FULFILLED")
           state.unitFamiliesListStatus = "fulfilled";
           state.unitFamiliesList = action.payload;
        })

         //fetch units
         .addCase(fetchUnits.pending, (state) => {
            state.unitListStatus = "loading";
        })
        .addCase(fetchUnits.rejected,(state) => {
            state.unitListStatus = "rejected";
            logger.log("fetchUnit::REJECTED");
        })
        .addCase(fetchUnits.fulfilled,(state,action) => {
           const { payload } = action;
           logger.log("fetchUnit::FULFILLED")
           state.unitListStatus = "fulfilled";
           state.unitList = action.payload;
        })

         //fetch allowances
         .addCase(fetchAllAllowances.pending, (state) => {
          state.unitListStatus = "loading";
      })
      .addCase(fetchAllAllowances.rejected,(state) => {
          state.unitListStatus = "rejected";
          logger.log("fetchUnit::REJECTED");
      })
      .addCase(fetchAllAllowances.fulfilled,(state,action) => {
         const { payload } = action;
         logger.log("fetchUnit::FULFILLED")
         state.allowanceListStatus = "fulfilled";
         state.allowanceList = action.payload;
      })

        //submit unit families
        .addCase(submitUnitFamilies.pending, (state) => {
            state.unitFamiliesSubmissionStatus = "loading";
          })
          .addCase(submitUnitFamilies.rejected, (state, action) => {
            state.unitFamiliesSubmissionStatus = "rejected";
            logger.warn("submitUnitFamilies::REJECTED", action.error);
          })
          .addCase(submitUnitFamilies.fulfilled, (state, action) => {
            const { payload } = action;
            logger.log("submitUnitFamilies::FULFILLED", { payload });
    
            state.unitFamiliesSubmissionStatus = "fulfilled";
          })

           //submit unit families
        .addCase(submitUnit.pending, (state) => {
            state.unitSubmissionStatus = "loading";
          })
          .addCase(submitUnit.rejected, (state, action) => {
            state.unitSubmissionStatus = "rejected";
            logger.warn("submitUnit::REJECTED", action.error);
          })
          .addCase(submitUnit.fulfilled, (state, action) => {
            const { payload } = action;
            logger.log("submitUnit::FULFILLED", { payload });
    
            state.unitSubmissionStatus = "fulfilled";
          })

          //submit unit edit
            //submit unit families
        .addCase(submitUnitEdit.pending, (state) => {
            state.unitEditStatus = "loading";
          })
          .addCase(submitUnitEdit.rejected, (state, action) => {
            state.unitEditStatus = "rejected";
            logger.warn("submitUnitEdit::REJECTED", action.error);
          })
          .addCase(submitUnitEdit.fulfilled, (state, action) => {
            const { payload } = action;
            logger.log("submitUnitEdit::FULFILLED", { payload });
    
            state.unitEditStatus = "fulfilled";
          })

          // deleteBranch
      .addCase(deleteUnit.pending, (state) => {
        state.deleteUnitStatus = "loading";
      })
      .addCase(deleteUnit.rejected, (state, action) => {
        state.deleteUnitStatus = "rejected";
        logger.warn("deleteUnit::REJECTED", action.error);
      })
      .addCase(deleteUnit.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("deleteUnit::FULFILLED");

        state.deleteUnitStatus = "fulfilled";
      })

         //submit allowance
         .addCase(submitNewAllowance.pending, (state) => {
          state.unitSubmissionStatus = "loading";
        })
        .addCase(submitNewAllowance.rejected, (state, action) => {
          state.unitSubmissionStatus = "rejected";
          logger.warn("submitNewAllowance::REJECTED", action.error);
        })
        .addCase(submitNewAllowance.fulfilled, (state, action) => {
          const { payload } = action;
          logger.log("submitNewAllowance::FULFILLED", { payload });
  
          state.allowanceSubmissionStatus = "fulfilled";
        })
    }
});

export default unitSlice.reducer;