// import { find } from "@workspace/repository/entities/organization-members";
// import { HttpError } from "@workspace/types/errors/http";
// import type { OrganizationRole } from "@workspace/types/use-cases/organizations";

// export const authorizeUserToUpdateOrganizationMember = async (
//   params: {
//         userId: string,
//         organizationMemberId: string,
//         organizationId: string
//     }
// ) => {
//   const { userId, organizationMemberId, organizationId } = params;

//   const { userRole, organizationMemberRole } = await fetchUserRoles({
//     userId,
//     organizationMemberId,
//     organizationId,
//   });

//   return userCanUpdateOrganizationMember({ userRole, organizationMemberRole });
// };

// export const fetchUserRoles = async (params: {
//     userId: string,
//     organizationMemberId: string,
//     organizationId: string
// }) => {
//     const { userId, organizationMemberId, organizationId } = params;

//     const [user, organizationMember] = await Promise.all([
//       find({ userId, organizationId }),
//       find({ userId: organizationMemberId, organizationId }),
//     ]);

//     return {
//         userRole: user.organizationRole,
//         organizationMemberRole: organizationMember.organizationRole,
//     };
// }

// export const userCanUpdateOrganizationMember = (params: {
//     userRole: OrganizationRole,
//     organizationMemberRole?: OrganizationRole
// }) => {
//     const { userRole, organizationMemberRole } = params;
//     if (userRole === "member") {
//         return false;
//     }

//     if (!organizationMemberRole) {
//         throw new HttpError(400, "Authorization gate error: Organization member role is required");
//     }

//     if (userRole === "admin" && organizationMemberRole === "owner") {
//         return false;
//     }

//     return true;
// }
