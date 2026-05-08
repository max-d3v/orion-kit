import { CreateOrganization } from "./create-organization";

export default function Onboarding({ className }: { className: string }) {
    return (
        <CreateOrganization className={className} />
    );
}