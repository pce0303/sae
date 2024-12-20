import { useState } from "react";

export const useSAEState = () => {
  const [password, setPassword] = useState("");
  const [clientPublicKey, setClientPublicKey] = useState("");
  const [serverPublicKey, setServerPublicKey] = useState("");
  const [sharedKey, setSharedKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [salt, setSalt] = useState("");
  const [commitData, setCommitData] = useState(null);
  const [commitProgress, setCommitProgress] = useState(0);
  const [confirmProgress, setConfirmProgress] = useState(0);
  const [commitMessage, setCommitMessage] = useState("");
  const [commitInterval, setCommitInterval] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [isCommitInProgress, setIsCommitInProgress] = useState(false);
  const [isConfirmInProgress, setIsConfirmInProgress] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null); 

  return {
    password, setPassword,
    clientPublicKey, setClientPublicKey,
    serverPublicKey, setServerPublicKey,
    sharedKey, setSharedKey,
    isAuthenticated, setIsAuthenticated,
    salt, setSalt,
    commitData, setCommitData,
    commitProgress, setCommitProgress,
    confirmProgress, setConfirmProgress,
    commitMessage, setCommitMessage,
    commitInterval, setCommitInterval,
    confirmMessage, setConfirmMessage,
    isCommitInProgress, setIsCommitInProgress,
    isConfirmInProgress, setIsConfirmInProgress,
    passwordStrength, setPasswordStrength
  };
};
