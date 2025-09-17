import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Copy, Lock, Unlock, Shield, Terminal } from "lucide-react";
import { encryptionMethods, getEncryptionMethod, type EncryptionMethod } from "@/lib/crypto";
import { useToast } from "@/hooks/use-toast";

export function CryptoTool() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string>(encryptionMethods[0].name);
  const [encryptionKey, setEncryptionKey] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(true);
  const { toast } = useToast();

  const currentMethod = getEncryptionMethod(selectedMethod);

  const processText = useCallback(
    (encrypt: boolean) => {
      if (!inputText.trim()) {
        toast({
          title: "Error",
          description: "Please enter some text to process",
          variant: "destructive",
        });
        return;
      }

      if (!currentMethod) return;

      try {
        let result: string;
        if (encrypt) {
          result = currentMethod.encrypt(inputText, encryptionKey);
        } else {
          result = currentMethod.decrypt(inputText, encryptionKey);
        }
        setOutputText(result);
        
        toast({
          title: "Success",
          description: `Text ${encrypt ? "encrypted" : "decrypted"} successfully`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "An error occurred",
          variant: "destructive",
        });
      }
    },
    [inputText, currentMethod, encryptionKey, toast]
  );

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: "Text copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy text",
        variant: "destructive",
      });
    }
  };

  const swapTexts = () => {
    const temp = inputText;
    setInputText(outputText);
    setOutputText(temp);
    setIsEncrypting(!isEncrypting);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Shield className="h-8 w-8 text-crypto-glow animate-text-glow" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-crypto-glow to-crypto-accent bg-clip-text text-transparent">
              CryptoTool
            </h1>
            <Terminal className="h-8 w-8 text-crypto-accent animate-text-glow" />
          </div>
          <p className="text-muted-foreground text-lg font-mono">
            Advanced encryption and decryption toolkit
          </p>
        </div>

        {/* Main Tool */}
        <Card className="bg-crypto-surface border-crypto-glow/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-crypto-glow">
              <Lock className="h-5 w-5" />
              Encryption Settings
            </CardTitle>
            <CardDescription className="font-mono">
              Choose your encryption method and configure parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Method Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="method" className="text-crypto-glow font-mono">
                  Encryption Method
                </Label>
                <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                  <SelectTrigger className="bg-crypto-terminal border-crypto-glow/30 font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-crypto-terminal border-crypto-glow/30">
                    {encryptionMethods.map((method) => (
                      <SelectItem
                        key={method.name}
                        value={method.name}
                        className="font-mono focus:bg-crypto-surface"
                      >
                        {method.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Key Input */}
              {currentMethod?.requiresKey && (
                <div className="space-y-2">
                  <Label htmlFor="key" className="text-crypto-accent font-mono">
                    Encryption Key
                  </Label>
                  <Input
                    id="key"
                    type="text"
                    value={encryptionKey}
                    onChange={(e) => setEncryptionKey(e.target.value)}
                    placeholder={currentMethod.keyPlaceholder}
                    className="bg-crypto-terminal border-crypto-glow/30 font-mono"
                  />
                </div>
              )}
            </div>

            {/* Text Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input */}
              <div className="space-y-3">
                <Label className="text-crypto-glow font-mono flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  Input Text
                </Label>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter text to encrypt or decrypt..."
                  className="min-h-[200px] bg-crypto-terminal border-crypto-glow/30 font-mono text-sm resize-none focus:ring-crypto-glow"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => processText(true)}
                    className="flex-1 bg-crypto-glow/10 text-crypto-glow border border-crypto-glow/30 hover:bg-crypto-glow/20 font-mono"
                    variant="outline"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Encrypt
                  </Button>
                  <Button
                    onClick={() => processText(false)}
                    className="flex-1 bg-crypto-accent/10 text-crypto-accent border border-crypto-accent/30 hover:bg-crypto-accent/20 font-mono"
                    variant="outline"
                  >
                    <Unlock className="h-4 w-4 mr-2" />
                    Decrypt
                  </Button>
                </div>
              </div>

              {/* Output */}
              <div className="space-y-3">
                <Label className="text-crypto-accent font-mono flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Output Text
                </Label>
                <Textarea
                  value={outputText}
                  readOnly
                  placeholder="Processed text will appear here..."
                  className="min-h-[200px] bg-crypto-terminal border-crypto-accent/30 font-mono text-sm resize-none focus:ring-crypto-accent"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => copyToClipboard(outputText)}
                    disabled={!outputText}
                    className="flex-1 bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 font-mono"
                    variant="outline"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Output
                  </Button>
                  <Button
                    onClick={swapTexts}
                    disabled={!outputText}
                    className="flex-1 bg-secondary/10 text-secondary-foreground border border-secondary/30 hover:bg-secondary/20 font-mono"
                    variant="outline"
                  >
                    ↕ Swap
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Method Info */}
        {currentMethod && (
          <Card className="bg-crypto-terminal border-crypto-glow/10">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-crypto-glow font-mono">
                  {currentMethod.name}
                </h3>
                <p className="text-sm text-muted-foreground font-mono">
                  {getMethodDescription(currentMethod.name)}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function getMethodDescription(methodName: string): string {
  const descriptions: Record<string, string> = {
    "Caesar Cipher": "Shifts each letter by a fixed number of positions in the alphabet",
    "Base64": "Encodes text using Base64 encoding scheme (commonly used in data transmission)",
    "ROT13": "Replaces each letter with the letter 13 positions ahead in the alphabet",
    "Reverse Text": "Simply reverses the order of characters in the text",
    "XOR Cipher": "Uses XOR operation with a key to encrypt/decrypt text",
  };
  return descriptions[methodName] || "Custom encryption method";
}