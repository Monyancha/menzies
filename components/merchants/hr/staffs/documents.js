import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState,Fragment } from "react";
import { useSession } from "next-auth/react";
import { Button, Checkbox, Select, Textarea, TextInput, FileInput, Card } from "@mantine/core";
import { getStaffRoles } from "../../../../src/store/partners/staff-slice";
import Link from "next/link";
import { DatePicker } from "@mantine/dates";
import store from "../../../../src/store/Store";
import { Table,Thead,Trow } from "../../../ui/layouts/scrolling-table";
import { fetchStaffAttendance } from "../../../../src/store/partners/staff-slice";
import { showNotification } from "@mantine/notifications";
import NewStaffDocumentModal from "../../../partners/staffs/new-staff-document-modal";
import TableCardHeader from "../../../ui/layouts/table-card-header";


function DocumentsForm() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const branch_id = useSelector((state) => state.branches.branch_id);

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [facebook, setFacebook] = useState();
  const [role, setRole] = useState();
  const [instagram, setInstagram] = useState();
  const [bio, setBio] = useState();
  const [rate, setRate] = useState();
  const [is_tenant, setIsTenant] = useState();
  const [can_book, setCanBook] = useState();
  const [show_on_marketplace, setShowOnMarketplace] = useState();
  const [rent, setRent] = useState();
  const [salary, setSalary] = useState();
  const [pay_day, setPayDay] = useState();
  const [password, setPassword] = useState();
  const [password_confirmation, setPasswordConfirmation] = useState();
  const [selected_staff, setStaffId] = useState();
  const [date_joined, setDate] = useState();
  const [docs_data, setDocs] = useState([{
    document_name: "",
    document_file: "",
    comment: ""
  }])

  const roles = useSelector((state) => state.staff.getStaffRoles);
  const dataStatus = useSelector((state) => state.branches.submitBranchStatus);
  const staffsList = useSelector(
    (state) => state.staff.staff_attendance_list
  );

  const staff_id = useSelector((state) => state.staff.current_staff_id);


  const show_payroll = useSelector((state) => state.staff.show_payroll);


  let options = staffsList?.map((staff) => ({
    value: staff?.id,
    label: staff?.name,
  }));


  const submitInfo = async () => {
    showNotification({
      title: "Success",
      message: "Financial Documents Succesfully Added",
      color: "green",
    });

  };

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session?.user?.accessToken;
    params["branch_id"] = "All";

    store.dispatch(fetchStaffAttendance(params));


  }, [dataStatus, session, status]);



  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getStaffRoles(params));
  }, [session, status]);

  const actions = (
    <Fragment>
      <div className="btn-group">
        <NewStaffDocumentModal/>


      </div>
    </Fragment>
  );


  return (

    <Card>
      <TableCardHeader actions={actions}>
      
      </TableCardHeader>
         <Table>
        <Thead>
          <tr>
            <th scope="col" className="th-primary">
             ID
            </th>
            <th scope="col" className="th-primary">
              Name
            </th>
            <th scope="col" className="th-primary">
              Dated Added
            </th>
            <th scope="col" className="th-primary">
              Document
            </th>
          </tr>
        </Thead>
        <tbody>

              <Trow>
                <>
                  <td>5</td>
                  <td>Contract</td>

                  <td>
                   Jan 2 2024
                  </td>
                 
                  <td>
                  <a
                href="/templates/sample-doc.docx"
                className="btn btn-sm btn-dark btn-outline ml-2"
              >
                <i className="fa-solid fa-download mr-2" />
                Download 
              </a>
                  </td>




                 
                </>
              </Trow>

             {show_payroll && (
               <Trow>
               <>
                 <td>6</td>
                 <td>Kra Pin</td>

                 <td>
                  Jan 4 2024
                 </td>
                
                 <td>
                 <a
               href="/templates/sample-doc.docx"
               className="btn btn-sm btn-dark btn-outline ml-2"
             >
               <i className="fa-solid fa-download mr-2" />
               Download 
             </a>
                 </td>




                
               </>
             </Trow>
             )}

        </tbody>
      </Table>
         

   


      
    </Card>


  )

}
export default DocumentsForm;