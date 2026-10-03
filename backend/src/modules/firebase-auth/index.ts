import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import FirebaseOtpAuthService from "./service"

export default ModuleProvider(Modules.AUTH, {
  services: [FirebaseOtpAuthService],
})
