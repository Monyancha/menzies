import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../lib/shared/logger";

const logger = getLogger("StaffSlice");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  staffList: [],
  staffListStatus: "idle",

  staffIncomeList: null,
  staffIncomeListStatus: "idle",

  staffTransactionList: null,
  staffTransactionListStatus: "idle",

  staffDetail: null,
  staffDetailStatus: "idle",
  staffAllowanceStatus:"idle",
  staffAllowanceList:null,
  removeAllowanceStatus:"idle",

  staffIncomeList: null,
  staffIncomeListStatus: "idle",

  staffIncomeExcel: null,
  staffIncomeExcelStatus: "idle",

  staffIncomeAllExcelStatus: "idle",

  allStaffIncomeList: null,
  allStaffIncomeListStatus: "idle",

  staffCommissionDefinitionList: null,
  staffCommissionDefinitionStatus: "idle",

  //getStaffList
  getStaffList: null,
  getStaffListStatus: "idle",

  getStaffRoles: null,
  getStaffRolesStatus: "idle",

  getStaffDetails: [],
  getStaffDetailsStatus: "idle",

  getStaffTransactions: null,
  getStaffTransactionsStatus: "idle",

  getStaffToShareCommission: null,
  getStaffToShareCommissionStatus: "idle",

  targetCommissions: null,
  targetCommissionsStatus: "idle",

  targetCommissionIncome: null,
  targetCommissionIncomeStatus: "idle",

  targetCommissionDetails: null,
  targetCommissionDetailsStatus: "idle",
  staff_attendance_list: [],
  staff_shifts:[],
  staff_attendance_days: [],
  week_date_ranges: [],
  month_date_ranges: [],
  month_start_end_dates: [],
  staff_departments_list:null,
  getStaffAttendanceStatus: "idle",
  getStaffAttendanceDaysStatus: "idle",
  submitAttendanceStatus:"idle",
  submitClientAttendanceStatus: "idle",
  createStaffPersonalStatus:"idle",
  current_staff_id:"",
  show_payroll:false,
  submitStaffDepartmentStatus:"idle",
  fetchStaffDepartmentsStatus:"idle",
  fetchHrDataStatus:"idle",
  hr_data:null
};

export const fetchTargetCommissionIncome = createAsyncThunk(
  "staff/fetchTargetCommissionIncome",
  async ({
    page = null,
    accessToken = null,

    staffId = null,
    startDate = null,
    endDate = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/partners/staff_target_income/${staffId}?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchTargetCommissionIncome::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchTargetCommissionIncome::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchTargetCommissionDetails = createAsyncThunk(
  "staff/fetchTargetCommissionDetails",
  async ({ accessToken = null, recordId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/partners/staff_targets/${recordId}?`;

    const startTime = new Date();
    logger.log("fetchTargetCommissionDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchTargetCommissionDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchTargetCommissions = createAsyncThunk(
  "staff/fetchTargetCommissions",
  async ({
    page = null,
    accessToken = null,

    branch_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/partners/staff_targets?`;
    }

    const params = {};
    params["branch_id"] = branch_id;
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchTargetCommissions::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchTargetCommissions::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchStaff = createAsyncThunk(
  "staff/fetchStaff",
  async ({
    page = null,
    accessToken = null,
    fetch_all = false,
    lean = false,
    branch_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/partners/staff?`;
    }

    const params = {};
    if (fetch_all) {
      params["get_all"] = true;
    }
    if (lean) {
      params["lean"] = true;
    }
    params["branch_id"] = branch_id;
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchStaff::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchStaff::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchStaffAttendanceDays = createAsyncThunk(
  "staff/fetchStaffAttendanceDays",
  async ({
    page = null,
    accessToken = null,
    start_date = null,
    end_date = null,
    branch_id = null,
    filter = null,
    staff_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/staff-attendance-days?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = filter;
    }

    if (start_date) {
      params["start_date"] = start_date;
    }
    if (end_date) {
      params["end_date"] = end_date;
    }

    params["branch_id"] = branch_id;
    params["staff_id"] = staff_id;
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchStaffAttendanceDays::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchStaffAttendanceDays::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchStaffAttendance = createAsyncThunk(
  "staff/fetchStaffAttendance",
  async ({
    page = null,
    accessToken = null,
    month = null,
    week = null,
    branch_id = null,
    filter = null,
    view = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/staff-attendance?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = filter;
    }

    if (month) {
      params["month"] = month;
    }
    if (week) {
      params["week"] = week;
    }

    params["branch_id"] = branch_id;
    params["view"] = view;
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchStaffAttendance::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchStaffAttendance::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const voidStaffIncome = createAsyncThunk(
  "staff/voidStaffIncome",
  async ({ accessToken = null, recordId = null } = {}) => {
    if (!accessToken || !recordId) {
      return;
    }

    const url = `${API_URL}/partners/staff_income/${recordId}/void`;

    const startTime = new Date();
    logger.log("voidStaffIncome::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
      method: "POST",
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("voidStaffIncome::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitStaffDepartment = createAsyncThunk(
  "BranchesSlice/submitStaffDepartment",
  async ({
    accessToken = null,
    name = null
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/add-staff-department`;

    let body = {};

    body["name"] = name;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitStaffDepartment::BEGIN", body);
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
      logger.log("submitStaffDepartment::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitStaffAttendance = createAsyncThunk(
  "staff/submitStaffAttendance",
  async ({
    accessToken = null,
    date = null,
    staff_id = null,
    time = null,
    time_in_out,
    shift_id=null
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/staff-attendance`;

    let body = {};

    body["attendance_date"] = time;
    body["staff_id"] = staff_id;
    body["shift_id"] = shift_id;
    body["time_in_out"] = time_in_out;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitStaffAttendance::BEGIN", body);
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
      logger.log("submitStaffAttendance::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitClientAttendance = createAsyncThunk(
  "staff/submitClientAttendance",
  async ({
    accessToken = null,

    client_id = null,
    membership_id = null

  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/membership-attendances`;

    let body = {};


    body["client_id"] = client_id;
    body["membership_id"] = membership_id;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitClientAttendance::BEGIN", body);
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
      logger.log("submitClientAttendance::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const recalculateStaffCommission = createAsyncThunk(
  "staff/recalculateStaffCommission",
  async ({
    accessToken = null,
    staffId = null,

    titemId = null,
    startDate = null,
    endDate = null,
    branch_id = null,
  } = {}) => {
    if (!accessToken || !staffId) {
      return;
    }

    let url = `${API_URL}/partners/staff/${staffId}/recalculate_commissions?`;

    const params = {};
    if (titemId) {
      params["titem_id"] = titemId;
    }

    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    params["branch_id"] = branch_id;
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("recalculateStaffCommission::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("recalculateStaffCommission::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchAllStaffIncome = createAsyncThunk(
  "staff/fetchAllStaffIncome",
  async ({
    page = null,
    accessToken = null,
    filter = null,
    startDate = null,
    endDate = null,
    branch_id = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/partners/staff_income_index?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = filter;
    }

    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    params["branch_id"] = branch_id;
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchAllStaffIncome::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchAllStaffIncome::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchStaffDetail = createAsyncThunk(
  "staff/fetchStaffDetail",
  async ({ accessToken = null, staffId = null } = {}) => {
    if (!accessToken || !staffId) {
      return;
    }

    let url = `${API_URL}/partners/staff/${staffId}?`;

    const startTime = new Date();
    logger.log("fetchStaffDetail::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchStaffDetail::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchStaffAllowances = createAsyncThunk(
  "staff/fetchStaffAllowances",
  async ({ accessToken = null, staffId = null } = {}) => {
    if (!accessToken || !staffId) {
      console.log("The selected staff is " + staffId);

      return;
    }

    let url = `${API_URL}/allowances-list/${staffId}?`;

    const startTime = new Date();
    logger.log("fetchStaffAllowances::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchStaffAllowances::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);



export const createStaff = createAsyncThunk(
  "staff/createStaff",
  async ({
    accessToken = null,
    name = null,
    email = null,
    facebook = null,
    phone = null,
    role = null,
    instagram = null,
    bio = null,
    rate = null,
    is_tenant = null,
    can_book = null,
    rent = null,
    salary = null,
    pay_day = null,
    password = null,
    password_confirmation = null,
    branch_id = null,
    date_joined = null,
    show_on_marketplace = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/partners/staff`;

    let body = {
      name,
      email,
      facebook,
      phone,
      role,
      instagram,
      bio,
      rate,
      is_tenant,
      can_book,
      rent,
      salary,
      pay_day,
      password,
      password_confirmation,
      branch_id,
      date_joined,
      show_on_marketplace,
    };

    logger.log("createStaff::BEGIN", body);
    body = JSON.stringify(body);

    const startTime = new Date();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("createStaff::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const createStaffPersonal = createAsyncThunk(
  "staff/createStaffPersonal",
  async ({
    accessToken = null,
    name = null,
    email = null,
    facebook = null,
    phone = null,
    role = null,
    bio = null,
    is_tenant = null,
    can_book = null,
    password = null,
    password_confirmation = null,
    branch_id = null,
    date_joined = null,
    show_on_marketplace = null,
    department_id=null,
    next_of_kin=null
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/personal-details`;

    let body = {
      name,
      email,
      facebook,
      phone,
      role,
      bio,
      is_tenant,
      can_book,
      password,
      password_confirmation,
      branch_id,
      date_joined,
      department_id,
      next_of_kin,
      show_on_marketplace,
    };

    logger.log("createStaffPersonal::BEGIN", body);
    body = JSON.stringify(body);

    const startTime = new Date();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("createStaffPersonal::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const createStaffAllowance = createAsyncThunk(
  "staff/createStaffAllowance",
  async ({
    accessToken = null,
    name = null,
    amount = null,
    staff_id = null
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/allowance-details`;

    let body = {
      name,
      amount,
      staff_id,
    };

    logger.log("createStaffAllowance::BEGIN", body);
    body = JSON.stringify(body);

    const startTime = new Date();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("createStaffAllowance::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const createStaffFinancial = createAsyncThunk(
  "staff/createStaffFinancial",
  async ({
    accessToken = null,
    kra_pin = null,
    nssf = null,
    nhif = null,
    rate = null,
    payment_freq = null,
    salary = null,
    pay_day = null,
    staff_id = null
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/financial-details`;

    let body = {
      kra_pin,
      nssf,
      nhif,
      rate,
      payment_freq,
      salary,
      pay_day,
      staff_id,
    };

    logger.log("createStaffFinancial::BEGIN", body);
    body = JSON.stringify(body);

    const startTime = new Date();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("createStaffFinancial::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const updateStaff = createAsyncThunk(
  "staff/updateStaff",
  async ({
    accessToken = null,
    staffId = null,

    name = null,
    email = null,
    facebook = null,
    phone = null,
    role = null,
    instagram = null,
    bio = null,
    rate = null,
    is_tenant = null,
    can_book = null,
    rent = null,
    salary = null,
    pay_day = null,
    password = null,
    password_confirmation = null,
    date_joined = null,
    show_on_marketplace = null,
  } = {}) => {
    if (!accessToken || !staffId) {
      return;
    }

    let url = `${API_URL}/partners/staff/${staffId}`;

    let body = {
      name,
      email,
      facebook,
      phone,
      role,
      instagram,
      bio,
      rate,
      is_tenant,
      can_book,
      rent,
      salary,
      pay_day,
      password,
      password_confirmation,
      date_joined,
      show_on_marketplace,
    };

    logger.log("updateStaff::BEGIN", body);
    body = JSON.stringify(body);

    const startTime = new Date();
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("updateStaff::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const deleteStaff = createAsyncThunk(
  "staff/deleteStaff",
  async ({ accessToken = null, staffId = null } = {}) => {
    if (!accessToken || !staffId) {
      return;
    }

    let url = `${API_URL}/partners/staff/${staffId}?`;

    const startTime = new Date();
    logger.log("deleteStaff::BEGIN");
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
      logger.log("deleteStaff::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchStaffIncomeList = createAsyncThunk(
  "staff/fetchStaffIncomeList",
  async ({
    page = null,
    accessToken = null,
    staffId = null,
    startDate = null,
    endDate = null,
  } = {}) => {
    if (!accessToken || !staffId) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/partners/staff/${staffId}/staff_income?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchStaffIncomeList::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchStaffIncomeList::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchStaffCommissionDefs = createAsyncThunk(
  "staff/fetchStaffCommissionDefs",
  async ({
    page = null,
    accessToken = null,
    staffId = null,
    pageSize = null,

    filter = null,
  } = {}) => {
    if (!accessToken || !staffId) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/partners/staff_sellable_commission_defs/${staffId}?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = filter;
    }
    if (pageSize) {
      params["page_size"] = pageSize;
    }
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchStaffCommissionDefs::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchStaffCommissionDefs::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const applyCommissionAll = createAsyncThunk(
  "staff/applyCommissionAll",
  async ({
    accessToken = null,

    staffId = null,
    type = null,
    value = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/partners/staff_sellable_commission_defs/${staffId}/apply_all`;

    let body = {
      type,
      value,
    };

    logger.log("applyCommissionAll::BEGIN", body);
    body = JSON.stringify(body);

    const startTime = new Date();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("applyCommissionAll::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const updateCommissionDefinitions = createAsyncThunk(
  "staff/updateCommissionDefinitions",
  async ({
    accessToken = null,

    staffId = null,
    sellables = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/partners/staff_sellable_commission_defs/${staffId}/store_values`;

    let body = {
      sellables,
    };

    logger.log("updateCommissionDefinitions::BEGIN", body);
    body = JSON.stringify(body);

    const startTime = new Date();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("updateCommissionDefinitions::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const updateStaffRate = createAsyncThunk(
  "staff/updateStaffRate",
  async ({
    accessToken = null,

    staffId = null,
    rate = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/partners/staff_sellable_commission_defs/${staffId}/flat_rate`;

    let body = {
      rate,
    };

    logger.log("updateStaffRate::BEGIN", body);
    body = JSON.stringify(body);

    const startTime = new Date();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("updateStaffRate::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchAllStaffIncomeExcel = createAsyncThunk(
  "staff/fetchAllStaffIncomeExcel",
  async ({
    accessToken = null,
    branch_id = null,
    startDate = null,
    endDate = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/partners/staff_income_all_excel?`;

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchAllStaffIncomeExcel::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.blob();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchAllStaffIncomeExcel::END", { took: seconds });

      if (!response.ok) {
        throw { message: "failure" };
      }

      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.target = "_blank";
      a.click();

      return { message: "success" };
    });

    return response;
  }
);

export const fetchStaffIncomeExcel = createAsyncThunk(
  "staff/fetchStaffIncomeExcel",
  async ({
    accessToken = null,
    staffId = null,
    startDate = null,
    endDate = null,
  } = {}) => {
    if (!accessToken || !staffId) {
      return;
    }

    let url = `${API_URL}/partners/staff/${staffId}/staff_income_excel?`;

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchStaffIncomeExcel::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.blob();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchStaffIncomeExcel::END", { took: seconds });

      if (!response.ok) {
        throw { message: "failure" };
      }

      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.target = "_blank";
      a.click();

      return { message: "success" };
    });

    return response;
  }
);

export const fetchStaffTransactionList = createAsyncThunk(
  "staff/fetchStaffTransactionList",
  async ({
    page = null,
    accessToken = null,
    staffId = null,
    startDate = null,
    endDate = null,
  } = {}) => {
    if (!accessToken || !staffId) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/partners/staff/${staffId}/staff_income_transactions?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchStaffTransactionList::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchStaffTransactionList::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchStaffTransactionListExcel = createAsyncThunk(
  "staff/fetchStaffTransactionListExcel",
  async ({
    page = null,
    accessToken = null,
    staffId = null,
    startDate = null,
    endDate = null,
  } = {}) => {
    if (!accessToken || !staffId) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/partners/staff/${staffId}/staff_income_transactions_excel?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchStaffTransactionListExcel::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.blob();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchStaffTransactionListExcel::END", { took: seconds });

      if (!response.ok) {
        throw { message: "failure" };
      }

      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.target = "_blank";
      a.click();

      return { message: "success" };
    });

    return response;
  }
);

export const getStaffTransactions = createAsyncThunk(
  "staff/getStaffTransactions",
  async ({
    page = null,
    accessToken = null,
    staffId = null,
    startDate = null,
    endDate = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/staff/${staffId}/transactions?`;
    }

    const params = {};

    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getStaffTransactions::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getStaffTransactions::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getStaffList = createAsyncThunk(
  "staff/getStaffList",
  async ({ page = null, accessToken = null, branch_id = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/staff/list?`;
    }
    const params = {};

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getStaffList::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getStaffList::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getStaffDetails = createAsyncThunk(
  "staff/getStaffDetails",
  async ({ accessToken = null, staffId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/staff/show/${staffId}`;

    const startTime = new Date();
    logger.log("getStaffDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getStaffDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getStaffToShareCommission = createAsyncThunk(
  "staff/getStaffToShareCommission",
  async ({ accessToken = null, branch_id } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/staff/to-share-commission?`;

    const params = {};

    params["branch_id"] = branch_id;

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getStaffToShareCommission::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getStaffToShareCommission::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getStaffRoles = createAsyncThunk(
  "staff/getStaffRoles",
  async ({ accessToken = null, staffId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/staff-roles`;

    const startTime = new Date();
    logger.log("getStaffRoles::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getStaffRoles::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchStaffDepartments = createAsyncThunk(
  "branches/fetchStaffDepartments",
  async ({
    page = null,
    accessToken = null,
    filter = null
  } = {}) => {
    if (!accessToken) {
      return;
    }
    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/staff-departments-list?`;
    }
    const params = {};

    if (filter) {
      params["filter"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchStaffDepartments::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchStaffDepartments::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchHrData = createAsyncThunk(
  "branches/fetchHrData",
  async ({
    page = null,
    accessToken = null,
    filter = null
  } = {}) => {
    if (!accessToken) {
      return;
    }
    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/hr-data?`;
    }
    const params = {};

    if (filter) {
      params["filter"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchHrData::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchHrData::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);



export const removeAllowance = createAsyncThunk(
  "staff/removeAllowance",
  async ({ accessToken = null, allowanceId = null } = {}) => {
    if (!accessToken || !allowanceId) {
      return;
    }

    let url = `${API_URL}/remove-staff-allowance/${allowanceId}`;

    const startTime = new Date();
    logger.log("removeAllowance::BEGIN");
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
      logger.log("removeAllowance::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const staff = createSlice({
  name: "staff",
  initialState,
  reducers: {
    setCurrentStaff(state,action)
    {
      const { staff_id } = action.payload
      state.staff = staff_id;
    },
    setShowPayroll(state,action)
    {

      state.show_payroll = true;
    }
  },
  extraReducers(builder) {
    builder
      // fetchTargetCommissionIncome
      .addCase(fetchTargetCommissionIncome.pending, (state) => {
        state.targetCommissionIncomeStatus = "loading";
      })
      .addCase(fetchTargetCommissionIncome.rejected, (state, action) => {
        state.targetCommissionIncomeStatus = "rejected";
        logger.log("fetchTargetCommissionIncome::REJECTED", { action });
      })
      .addCase(fetchTargetCommissionIncome.fulfilled, (state, action) => {
        logger.log("fetchTargetCommissionIncome::FULFILLED", {
          data: action.payload,
        });

        state.targetCommissionIncomeStatus = "fulfilled";
        state.targetCommissionIncome = action.payload;
      })

      // fetchTargetCommissionDetails
      .addCase(fetchTargetCommissionDetails.pending, (state) => {
        state.targetCommissionDetailsStatus = "loading";
      })
      .addCase(fetchTargetCommissionDetails.rejected, (state, action) => {
        state.targetCommissionDetailsStatus = "rejected";
        logger.log("fetchTargetCommissionDetails::REJECTED", { action });
      })
      .addCase(fetchTargetCommissionDetails.fulfilled, (state, action) => {
        logger.log("fetchTargetCommissionDetails::FULFILLED", {
          data: action.payload,
        });

        state.targetCommissionDetailsStatus = "fulfilled";
        state.targetCommissionDetails = action.payload;
      })

      // fetchTargetCommissions
      .addCase(fetchTargetCommissions.pending, (state) => {
        state.targetCommissionsStatus = "loading";
      })
      .addCase(fetchTargetCommissions.rejected, (state, action) => {
        state.targetCommissionsStatus = "rejected";
        logger.log("fetchTargetCommissions::REJECTED", { action });
      })
      .addCase(fetchTargetCommissions.fulfilled, (state, action) => {
        logger.log("fetchTargetCommissions::FULFILLED", {
          data: action.payload,
        });

        state.targetCommissionsStatus = "fulfilled";
        state.targetCommissions = action.payload;
      })

      // getStaffDetails Data
      .addCase(getStaffDetails.pending, (state) => {
        state.getStaffDetailsStatus = "loading";
      })
      .addCase(getStaffDetails.rejected, (state) => {
        state.getStaffDetailsStatus = "rejected";
        logger.log("getStaffDetails::REJECTED");
      })
      .addCase(getStaffDetails.fulfilled, (state, action) => {
        state.getStaffDetailsStatus = "fulfilled";
        state.getStaffDetails = action.payload;
      })

      //getStaffTransactions
      .addCase(getStaffTransactions.pending, (state) => {
        state.getStaffTransactionsStatus = "loading";
      })
      .addCase(getStaffTransactions.rejected, (state) => {
        state.getStaffTransactionsStatus = "rejected";
        logger.log("getStaffTransactions::REJECTED");
      })
      .addCase(getStaffTransactions.fulfilled, (state, action) => {
        state.getStaffTransactionsStatus = "fulfilled";
        state.getStaffTransactions = action.payload;
      })

      //getStaffToShareCommission
      .addCase(getStaffToShareCommission.pending, (state) => {
        state.getStaffToShareCommissionStatus = "loading";
      })
      .addCase(getStaffToShareCommission.rejected, (state) => {
        state.getStaffToShareCommissionStatus = "rejected";
        logger.log("getStaffToShareCommission::REJECTED");
      })
      .addCase(getStaffToShareCommission.fulfilled, (state, action) => {
        state.getStaffToShareCommissionStatus = "fulfilled";
        state.getStaffToShareCommission = action.payload;
      })

      // getStaffRoles Data
      .addCase(getStaffRoles.pending, (state) => {
        state.getStaffRolesStatus = "loading";
      })
      .addCase(getStaffRoles.rejected, (state) => {
        state.getStaffRolesStatus = "rejected";
        logger.log("getStaffRoles::REJECTED");
      })
      .addCase(getStaffRoles.fulfilled, (state, action) => {
        state.getStaffRolesStatus = "fulfilled";
        state.getStaffRoles = action.payload;
      })

      // getStaffList Data
      .addCase(getStaffList.pending, (state) => {
        state.getStaffListStatus = "loading";
      })
      .addCase(getStaffList.rejected, (state) => {
        state.getStaffListStatus = "rejected";
        logger.log("getStaffList::REJECTED");
      })
      .addCase(getStaffList.fulfilled, (state, action) => {
        state.getStaffListStatus = "fulfilled";
        state.getStaffList = action.payload;
      })

      // submit Staff Personal Info
      .addCase(createStaffPersonal.pending, (state) => {
        state.createStaffPersonalStatus = "loading";
      })
      .addCase(createStaffPersonal.rejected, (state, action) => {
        state.createStaffPersonalStatus = "rejected";
        logger.warn("createStaffPersonal::REJECTED", action.error);
      })
      .addCase(createStaffPersonal.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("createStaffPersonal::FULFILLED", { payload });

        state.createStaffPersonalStatus = "fulfilled";

        console.log(payload?.id)
        state.current_staff_id = payload.id;
      })

      // submit Staff Attendance
      .addCase(submitStaffAttendance.pending, (state) => {
        state.submitAttendanceStatus = "loading";
      })
      .addCase(submitStaffAttendance.rejected, (state, action) => {
        state.submitAttendanceStatus = "rejected";
        logger.warn("submitStaffAttendance::REJECTED", action.error);
      })
      .addCase(submitStaffAttendance.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitStaffAttendance::FULFILLED", { payload });

        state.submitAttendanceStatus = "fulfilled";
      })

      // submit Department
      .addCase(submitStaffDepartment.pending, (state) => {
        state.submitStaffDepartmentStatus = "loading";
      })
      .addCase(submitStaffDepartment.rejected, (state, action) => {
        state.submitStaffDepartmentStatus = "rejected";
        logger.warn("submitStaffDepartment::REJECTED", action.error);
      })
      .addCase(submitStaffDepartment.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitStaffDepartment::FULFILLED", { payload });

        state.submitStaffDepartmentStatus = "fulfilled";
      })


      // submit Client Attendance
      .addCase(submitClientAttendance.pending, (state) => {
        state.submitClientAttendanceStatus = "loading";
      })
      .addCase(submitClientAttendance.rejected, (state, action) => {
        state.submitClientAttendanceStatus = "rejected";
        logger.warn("submitClientAttendance::REJECTED", action.error);
      })
      .addCase(submitClientAttendance.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitClientAttendance::FULFILLED", { payload });

        state.submitClientAttendanceStatus = "fulfilled";
      })

      // getStaffAttendance  Data
      .addCase(fetchStaffAttendance.pending, (state) => {
        state.getStaffAttendanceStatus = "loading";
      })
      .addCase(fetchStaffAttendance.rejected, (state) => {
        state.getStaffAttendanceStatus = "rejected";
        logger.log("getStaffAttendance::REJECTED");
      })
      .addCase(fetchStaffAttendance.fulfilled, (state, action) => {
        state.getStaffAttendanceStatus = "fulfilled";
        const data = action.payload;
        state.staff_attendance_list = data.staff_attendance;
        state.staff_shifts = data.staff_shifts;
        state.week_date_ranges = data.week_date_ranges;
        state.month_date_ranges = data.month_date_ranges;
        state.month_start_end_dates = data.month_start_end_dates;
      })

      // getStaffAttendance  Data
      .addCase(fetchStaffAttendanceDays.pending, (state) => {
        state.getStaffAttendanceDaysStatus = "loading";
      })
      .addCase(fetchStaffAttendanceDays.rejected, (state) => {
        state.getStaffAttendanceDaysStatus = "rejected";
        logger.log("fetchStaffAttendanceDays::REJECTED");
      })
      .addCase(fetchStaffAttendanceDays.fulfilled, (state, action) => {
        state.getStaffAttendanceDaysStatus = "fulfilled";
        const data = action.payload;
        state.staff_attendance_days = data;
      })

      .addCase(fetchStaff.pending, (state) => {
        state.staffListStatus = "loading";
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.staffListStatus = "rejected";
        logger.log("fetchStaff::REJECTED", action.error);
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchStaff::FULFILLED", { payload });

        state.staffListStatus = "fulfilled";
        state.staffList = action.payload;

        if (typeof window !== "undefined") {
          try {
            window.sessionStorage.setItem(
              "staff",
              JSON.stringify(action.payload)
            );
          } catch (e) {
            logger.log("fetchStaff::ERROR", {
              message: "Could not set storage",
            });
          }
        }
      })

      // fetchStaffDetail Data
      .addCase(fetchStaffDetail.pending, (state) => {
        state.staffDetailStatus = "loading";
      })
      .addCase(fetchStaffDetail.rejected, (state) => {
        state.staffDetailStatus = "rejected";
        logger.log("fetchStaffDetail::REJECTED");
      })
      .addCase(fetchStaffDetail.fulfilled, (state, action) => {
        state.staffDetailStatus = "fulfilled";
        state.staffDetail = action.payload;
      })

      // fetchStaffDetail Data
      .addCase(fetchStaffAllowances.pending, (state) => {
        state.staffAllowanceStatus = "loading";
      })
      .addCase(fetchStaffAllowances.rejected, (state) => {
        state.staffAllowanceStatus = "rejected";
        logger.log("fetchStaffAllowances::REJECTED");
      })
      .addCase(fetchStaffAllowances.fulfilled, (state, action) => {
        state.staffAllowanceStatus = "fulfilled";
        state.staffAllowanceList = action.payload;
      })

      // fetchStaffTransactionList Data
      .addCase(fetchStaffTransactionList.pending, (state) => {
        state.staffTransactionListStatus = "loading";
      })
      .addCase(fetchStaffTransactionList.rejected, (state) => {
        state.staffTransactionListStatus = "rejected";
        logger.log("fetchStaffTransactionList::REJECTED");
      })
      .addCase(fetchStaffTransactionList.fulfilled, (state, action) => {
        state.staffTransactionListStatus = "fulfilled";
        state.staffTransactionList = action.payload;
      })

      // fetchStaffIncomeList Data
      .addCase(fetchStaffIncomeList.pending, (state) => {
        state.staffIncomeListStatus = "loading";
      })
      .addCase(fetchStaffIncomeList.rejected, (state) => {
        state.staffIncomeListStatus = "rejected";
        logger.log("fetchStaffIncomeList::REJECTED");
      })
      .addCase(fetchStaffIncomeList.fulfilled, (state, action) => {
        state.staffIncomeListStatus = "fulfilled";
        state.staffIncomeList = action.payload;
      })

      // fetchAllStaffIncome Data
      .addCase(fetchAllStaffIncome.pending, (state) => {
        state.allStaffIncomeListStatus = "loading";
      })
      .addCase(fetchAllStaffIncome.rejected, (state) => {
        state.allStaffIncomeListStatus = "rejected";
        logger.log("fetchStaffIncomeList::REJECTED");
      })
      .addCase(fetchAllStaffIncome.fulfilled, (state, action) => {
        state.allStaffIncomeListStatus = "fulfilled";
        state.allStaffIncomeList = action.payload;
      })

      // fetchStaffCommissionDefs
      .addCase(fetchStaffCommissionDefs.pending, (state) => {
        state.staffCommissionDefinitionStatus = "loading";
      })
      .addCase(fetchStaffCommissionDefs.rejected, (state) => {
        state.staffCommissionDefinitionStatus = "rejected";
        logger.log("fetchStaffCommissionDefs::REJECTED");
      })
      .addCase(fetchStaffCommissionDefs.fulfilled, (state, action) => {
        state.staffCommissionDefinitionStatus = "fulfilled";
        state.staffCommissionDefinitionList = action.payload;
      })

      // fetchStaffIncomeExcel
      .addCase(fetchStaffIncomeExcel.pending, (state) => {
        state.staffIncomeExcelStatus = "loading";
      })
      .addCase(fetchStaffIncomeExcel.rejected, (state) => {
        state.staffIncomeExcelStatus = "rejected";
        logger.log("fetchStaffIncomeExcel::REJECTED");
      })
      .addCase(fetchStaffIncomeExcel.fulfilled, (state, action) => {
        state.staffIncomeExcelStatus = "fulfilled";
      })

      // fetchAllStaffIncomeExcel
      .addCase(fetchAllStaffIncomeExcel.pending, (state) => {
        state.staffIncomeAllExcelStatus = "loading";
      })
      .addCase(fetchAllStaffIncomeExcel.rejected, (state) => {
        state.staffIncomeAllExcelStatus = "rejected";
        logger.log("fetchStaffIncomeAllExcel::REJECTED");
      })
      .addCase(fetchAllStaffIncomeExcel.fulfilled, (state, action) => {
        state.staffIncomeAllExcelStatus = "fulfilled";
      })

      // removeAllowance
      .addCase(removeAllowance.pending, (state) => {
        state.removeAllowanceStatus = "loading";
      })
      .addCase(removeAllowance.rejected, (state, action) => {
        state.removeAllowanceStatus = "rejected";
        logger.warn("removeAllowance::REJECTED", action.error);
      })
      .addCase(removeAllowance.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("removeAllowance::FULFILLED");

        state.removeAllowanceStatus = "fulfilled";
      })

      //fetch staff departments
      .addCase(fetchStaffDepartments.pending, (state) => {
        state.fetchStaffDepartmentsStatus = "loading";
      })
      .addCase(fetchStaffDepartments.rejected, (state, action) => {
        state.fetchStaffDepartmentsStatus = "rejected";
        logger.warn("fetchStaffDepartments::REJECTED", action.error);
      })
      .addCase(fetchStaffDepartments.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchStaffDepartments::FULFILLED", { payload });

        state.fetchStaffDepartmentsStatus = "fulfilled";
        state.staff_departments_list = action.payload;
      })

      //fetch Hr 
      .addCase(fetchHrData.pending, (state) => {
        state.fetchHrDataStatus = "loading";
      })
      .addCase(fetchHrData.rejected, (state, action) => {
        state.fetchHrDataStatus = "rejected";
        logger.warn("fetchHrData::REJECTED", action.error);
      })
      .addCase(fetchHrData.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchHrData::FULFILLED", { payload });

        state.fetchHrDataStatus = "fulfilled";
        state.hr_data = action.payload;
      })

  },
});

export const {setCurrentStaff,setShowPayroll} = staff.actions;

export default staff.reducer;
