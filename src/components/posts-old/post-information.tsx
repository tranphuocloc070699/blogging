import FormGroup from "@/components/form/form-group";
import {cn} from "@/lib/utils";


export default function PostInformation({className}: { className?: string }) {
  return (
      <FormGroup
          title="Summary"
          description="Edit your product description and necessary information from here"
          className={cn(className)}
      >
        qwdqwdqwdqwdqwdqwdqwd
      </FormGroup>
  );
}
