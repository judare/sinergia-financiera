const Status = ({ status }: { status: string }) => {
  const statuses: any = {
    paused: {
      label: "Pausada",
      color: "bg-yellow-100 text-yellow-800",
    },
    running: {
      label: "En curso",
      color: "bg-blue-100 text-blue-800",
    },
    successful: {
      label: "Exitosa",
      color: "bg-green-100 text-green-800",
    },
    success: {
      label: "Exitosa",
      color: "bg-green-100 text-green-800",
    },
    failed: {
      label: "Fallida",
      color: "bg-red-100 text-red-800",
    },
    pending: {
      label: "Pendiente",
      color: "bg-gray-100 text-gray-800",
    },
  } as const;

  const statusObj = statuses[status] || statuses.pending;

  return (
    <div
      className={`rounded-full px-2 py-0.5 text-xs font-light ${statusObj?.color}`}
    >
      {statusObj?.label}
    </div>
  );
};

export default Status;
