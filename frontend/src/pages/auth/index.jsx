import CommonForm from "@/components/common-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInFormControls, signUpFormControls } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
    setOnRegisterSuccess,
  } = useContext(AuthContext);

  useEffect(() => {
    // Set callback to switch to signin tab after successful registration
    setOnRegisterSuccess(() => () => {
      setActiveTab("signin");
    });
  }, [setOnRegisterSuccess]);

  function handleTabChange(value) {
    setActiveTab(value);
  }

  function checkIfSignInFormIsValid() {
    return (
      signInFormData &&
      signInFormData.userEmail !== "" &&
      signInFormData.password !== ""
    );
  }

  function checkIfSignUpFormIsValid() {
    return (
      signUpFormData &&
      signUpFormData.userName !== "" &&
      signUpFormData.userEmail !== "" &&
      signUpFormData.password !== ""
    );
  }

  console.log(signInFormData);

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F7FA]">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-[#E0E7F1] bg-white shadow-sm">
        <Link to={"/"} className="flex items-center justify-center">
          <img src="../../../civoraX.png" className="h-8" />
        </Link>
      </header>

      <div className="flex items-center justify-center flex-1 px-4 py-12">
        <div className="w-full max-w-md">
          {/* Decorative Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#142C52] mb-2">
              Welcome Back
            </h1>
            <p className="text-[#16808D] text-sm">
              Sign in or create an account to continue
            </p>
          </div>

          <Tabs
            value={activeTab}
            defaultValue="signin"
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-[#F4F7FA] border border-[#E0E7F1] rounded-lg p-1 mb-6">
              <TabsTrigger
                value="signin"
                className="data-[state=active]:bg-[#16808D] data-[state=active]:text-white text-[#142C52] font-medium rounded-md transition-all duration-300"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-[#16808D] data-[state=active]:text-white text-[#142C52] font-medium rounded-md transition-all duration-300"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-0">
              <Card className="bg-white border border-[#E0E7F1] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="space-y-2 pb-4">
                  <CardTitle className="text-2xl font-bold text-[#142C52]">
                    Sign in to your account
                  </CardTitle>
                  <CardDescription className="text-[#16808D]">
                    Enter your email and password to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <CommonForm
                    formControls={signInFormControls}
                    buttonText={"Sign In"}
                    formData={signInFormData}
                    setFormData={setSignInFormData}
                    isButtonDisabled={!checkIfSignInFormIsValid()}
                    handleSubmit={handleLoginUser}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup" className="mt-0">
              <Card className="bg-white border border-[#E0E7F1] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="space-y-2 pb-4">
                  <CardTitle className="text-2xl font-bold text-[#142C52]">
                    Create a new account
                  </CardTitle>
                  <CardDescription className="text-[#16808D]">
                    Enter your details to get started
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <CommonForm
                    formControls={signUpFormControls}
                    buttonText={"Sign Up"}
                    formData={signUpFormData}
                    setFormData={setSignUpFormData}
                    isButtonDisabled={!checkIfSignUpFormIsValid()}
                    handleSubmit={handleRegisterUser}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Footer Text */}
          <p className="text-center text-sm text-[#16808D] mt-6">
            By continuing, you agree to our Terms & Conditions
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
