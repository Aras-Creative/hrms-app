export const useJobRoleOptions = (jobRoleData, jobRoleLoading, JobRoleError) => {
  return (() => {
    if (jobRoleLoading) {
      return [{ value: "", label: "Loading..." }];
    }

    if (JobRoleError) {
      return [{ value: "", label: "Failed to load job roles" }];
    }

    return (
      jobRoleData?.map((role) => ({
        value: role.jobRoleId,
        label: `${role.jobRoleTitle} (${role.jobRoleId})`,
      })) || []
    );
  })();
};
