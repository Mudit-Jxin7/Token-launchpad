import { useState } from 'react';
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  TOKEN_2022_PROGRAM_ID,
  getMintLen,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  TYPE_SIZE,
  LENGTH_SIZE,
  ExtensionType,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction
} from "@solana/spl-token";
import { createInitializeInstruction, pack } from '@solana/spl-token-metadata';

const Launchpad = () => {
  const [form, setForm] = useState({
    name: '',
    symbol: '',
    image: null as File | null,
    initialSupply: ''
  });

  const IMGBB_API_KEY = process.env.IMGBB_API_KEY || '';
  const JSONBIN_MASTER_KEY = process.env.JSONBIN_MASTER_KEY || '';

  const { connection } = useConnection();
  const wallet = useWallet();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.publicKey) return alert("Wallet not connected!");
    if (!form.image) return alert("Please upload an image!");

    try {
      // 1. Upload image to ImgBB to get a public URL
      const formData = new FormData();
      formData.append('image', form.image);

      const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      if (!imgbbRes.ok) {
        alert("Image upload failed!");
        return;
      }

      const imgbbJson = await imgbbRes.json();
      const imageUrl = imgbbJson.data.url;

      // 2. Prepare metadata JSON with public image URL
      const metadataJSON = {
        name: form.name,
        symbol: form.symbol,
        description: "My custom token",
        image: imageUrl,
      };

      const jsonbinRes = await fetch('https://api.jsonbin.io/v3/b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': JSONBIN_MASTER_KEY,
        },
        body: JSON.stringify(metadataJSON),
      });

      if (!jsonbinRes.ok) {
        alert("Metadata JSON upload failed!");
        return;
      }

      const jsonbinJson = await jsonbinRes.json();
      const binId = jsonbinJson.metadata.id;

      const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': JSONBIN_MASTER_KEY,
        }
      });

      console.log("Metadata JSON uploaded successfully:", res);

      // 4. Create token mint and metadata on Solana blockchain
    //   const mintKeypair = Keypair.generate();
    //   const metadata = {
    //     mint: mintKeypair.publicKey,
    //     name: form.name,
    //     symbol: form.symbol.padEnd(8, ' '),
    //     uri: metadataUri,
    //     additionalMetadata: [],
    //   };

    //   const mintLen = getMintLen([ExtensionType.MetadataPointer]);
    //   const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
    //   const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

    //   const tx1 = new Transaction().add(
    //     SystemProgram.createAccount({
    //       fromPubkey: wallet.publicKey,
    //       newAccountPubkey: mintKeypair.publicKey,
    //       space: mintLen,
    //       lamports,
    //       programId: TOKEN_2022_PROGRAM_ID,
    //     }),
    //     createInitializeMetadataPointerInstruction(mintKeypair.publicKey, wallet.publicKey, mintKeypair.publicKey, TOKEN_2022_PROGRAM_ID),
    //     createInitializeMintInstruction(mintKeypair.publicKey, 9, wallet.publicKey, null, TOKEN_2022_PROGRAM_ID),
    //     createInitializeInstruction({
    //       programId: TOKEN_2022_PROGRAM_ID,
    //       mint: mintKeypair.publicKey,
    //       metadata: mintKeypair.publicKey,
    //       name: metadata.name,
    //       symbol: metadata.symbol,
    //       uri: metadata.uri,
    //       mintAuthority: wallet.publicKey,
    //       updateAuthority: wallet.publicKey,
    //     })
    //   );

    //   tx1.feePayer = wallet.publicKey;
    //   tx1.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    //   tx1.partialSign(mintKeypair);
    //   await wallet.sendTransaction(tx1, connection);

    //   console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`);

    //   const associatedToken = getAssociatedTokenAddressSync(
    //     mintKeypair.publicKey,
    //     wallet.publicKey,
    //     false,
    //     TOKEN_2022_PROGRAM_ID
    //   );

    //   const tx2 = new Transaction().add(
    //     createAssociatedTokenAccountInstruction(
    //       wallet.publicKey,
    //       associatedToken,
    //       wallet.publicKey,
    //       mintKeypair.publicKey,
    //       TOKEN_2022_PROGRAM_ID,
    //     )
    //   );
    //   await wallet.sendTransaction(tx2, connection);

    //   const tx3 = new Transaction().add(
    //     createMintToInstruction(
    //       mintKeypair.publicKey,
    //       associatedToken,
    //       wallet.publicKey,
    //       parseInt(form.initialSupply) * 10 ** 9,
    //       [],
    //       TOKEN_2022_PROGRAM_ID
    //     )
    //   );
    //   await wallet.sendTransaction(tx3, connection);

    //   alert("Token launched successfully! 🚀");
    } catch (error) {
      console.error("Error launching token:", error);
      alert("Something went wrong during the launch. Check console for details.");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Token Name
          <input type="text" name="name" value={form.name} onChange={handleChange} style={styles.input} required />
        </label>

        <label style={styles.label}>Symbol
          <input type="text" name="symbol" value={form.symbol} onChange={handleChange} style={styles.input} required />
        </label>

        <label style={styles.label}>Image Upload
          <input type="file" name="image" onChange={handleChange} style={styles.input} accept="image/*" required />
        </label>

        <label style={styles.label}>Initial Supply
          <input type="number" name="initialSupply" value={form.initialSupply} onChange={handleChange} style={styles.input} min="1" required />
        </label>

        <button type="submit" style={styles.button}>Launch Token 🚀</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#2c2c3e',
    padding: '2rem',
    borderRadius: '12px',
    maxWidth: '500px',
    margin: '0 auto',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    color: '#f1f1f1'
  } as React.CSSProperties,
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem'
  },
  label: {
    fontWeight: 'bold',
    color: '#ccc',
  },
  input: {
    width: '100%',
    padding: '0.6rem',
    marginTop: '0.25rem',
    borderRadius: '6px',
    backgroundColor: '#1e1e2f',
    color: '#f1f1f1',
    border: '1px solid #3a3a4f',
    outline: 'none',
    fontSize: '1rem'
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#4e9eff',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.2s ease'
  }
};

export default Launchpad;
