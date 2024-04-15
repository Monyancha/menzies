import React from "react";
import Image from "next/dist/client/image";
import { IconUsers, IconEye, IconLock } from "@tabler/icons";
import { useSelector } from "react-redux";
import { Draggable } from "@hello-pangea/dnd";
import TaskInfoModal from "./task-info-modal";
import { isMerchant } from "@/lib/shared/roles_and_permissions";
import { hasBeenGranted } from "@/store/merchants/settings/access-control-slice";
import { formatDate } from "@/lib/shared/data-formatters";

function CardItem({ data, index, isUserMerchant }) {
  const canDragDrop = useSelector(hasBeenGranted("can_drag_drop"));
  const isDraggable = !canDragDrop;
  // console.log("the drag is " + canDragDrop);

  return (
    <Draggable
      key={data?.id}
      isDragDisabled={isDraggable}
      draggableId={data?.id?.toString()}
      index={index}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white rounded-md p-3 m-3 mt-0 last:mb-0"
        >
         
          
          <h5 className="text-md text-lg leading-6">{data?.name}</h5>

          <div className="grid grid-flow-row mb-2">
          <label
            className={`bg-gradient-to-r
              rounded text-black text-xs text-md
              leading-4
              `}
          >
            Start : {formatDate(data?.start_date)}
          </label>
          <label
            className={`bg-gradient-to-r
              rounded text-black text-sm
              `}
          >
            End : {formatDate(data?.end_date)}
          </label>
          </div>
          <div className="flex justify-between">
            <div className="flex space-x-2 items-center">
              <span className="flex space-x-1 items-center">
                <IconUsers className="w-4 h-4 text-gray-500" />
                <span>{data?.staff_tasks?.length}</span>
                {/* <IconLock  cursor="pointer" onClick={() => disableDrag(true)} className="w-5 h-5 text-gray-500" /> */}
              </span>
              {/* <span className="flex space-x-1 items-center"> */}
              {/* <PaperClipIcon className="w-4 h-4 text-gray-500" /> */}
              {/* <span>{new Date().toISOString()}</span> */}
              {/* </span> */}
            </div>

            <ul className="flex space-x-3">
              {/* {data.assignees.map((ass, index) => {
                return (
                  <li key={index}>
                    <Image
                      src={ass.avt}
                      width="36"
                      height="36"
                      objectFit="cover"
                      className=" rounded-full "
                    />
                  </li>
                );
              })} */}
              <li></li>
              <li>
                <button
                  className="border border-dashed flex items-center w-9 h-9 border-gray-500 justify-center
                    rounded-full"
                >
                  <TaskInfoModal item={data} />
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default CardItem;
