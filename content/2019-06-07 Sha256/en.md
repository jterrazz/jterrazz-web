![](assets/thumbnail.jpg)

# Hashing in C: A Deep Dive into SHA-256 and MD5

Ever wonder what keeps your online world safe? From your bank transactions to your passwords, the unsung heroes are cryptographic hash functions. Today, I'm pulling back the curtain on two of the big ones: MD5 and SHA-256. We're not just talking theory; we're getting our hands dirty with C code.

I've even dropped a link to a GitHub repo with the full implementation. Ready to level up your crypto game? Let's get into it.

[🔗 Explore the magical realm of hash functions in our GitHub repository](https://github.com/jterrazz/42-ssl-md5?source=post_page-----78c17e657794--------------------------------)

## 🔐 Cryptographic Functions: The Silent Guardians of Your Digital Life

Think of cryptographic functions as the invisible force field of the digital universe. They're constantly working behind the scenes to:

* **Guarantee data integrity**, making sure the files and messages you send and receive are exactly as they were intended.
* **Securely verify passwords** without ever storing the raw text.
* Power the **"proof of work"** that's fundamental to cryptocurrencies like Bitcoin and Ethereum.
* Enable **digital signatures**, which are the online equivalent of a legally binding signature.

These digital powerhouses take any input you throw at them—a single character or a massive file—and crunch it down into a fixed-length string of characters called a hash. It's like creating a unique fingerprint for your data.

* **MD5** spits out a 128-bit hash (that's 32 hexadecimal characters).
* **SHA-256** creates a 256-bit hash (64 hexadecimal characters).

![Hash Function Visualization](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*aZh9gQlawdGcwSrCO0KOeA.png)

### The Superpowers of a Solid Hash Function

A good hash function has a few key properties that make it a cryptographic Swiss Army knife:

1. **Determinism**: Same input, same output. Every single time.
2. **Speed**: They're built for speed, calculating hashes in a flash.
3. **One-wayness**: You can't reverse-engineer the input from the hash. It's a one-way street.
4. **Collision resistance**: It's practically impossible to find two different inputs that create the same hash.
5. **Avalanche effect**: Change a single bit in the input, and the output hash changes dramatically and unpredictably.

## The Main Event: MD5 vs. SHA-256

### MD5: The Seasoned Veteran (Who Should Be Retired)

MD5 was a workhorse in its day, but its time has passed. It's been found to have significant vulnerabilities, particularly to "collision attacks," where different inputs can produce the same hash. This makes it a no-go for anything security-related.

So, where might you still see MD5?

* As a simple checksum to verify file integrity against accidental corruption.
* In legacy systems or non-security-critical applications where speed is the only concern.

**Bottom line: Don't use MD5 for security.** It's like bringing a knife to a gunfight.

### SHA-256: The Modern Standard

SHA-256 is part of the SHA-2 family, designed by the NSA to be the successor to SHA-1 (which was also found to be vulnerable). It's now the industry standard for a wide range of applications.

SHA-256 is considered secure because:

* Reversing the hash to find the original input is computationally infeasible.
* It has strong collision resistance, making it incredibly difficult to find two inputs with the same hash.

However, even with its strengths, I wouldn't recommend using "raw" SHA-256 for storing passwords. It's so fast that it can be vulnerable to brute-force attacks. For password hashing, slower, more complex algorithms like Bcrypt or Scrypt are the way to go.

## Under the Hood: How the Magic Happens

### Step 1: Prepping the Message

Before the hashing can begin, the input message has to be formatted in a very specific way:

1. The message is broken down into **512-bit chunks**.
2. A single '1' bit is tacked on to the end of the message.
3. '0' bits are added until the message length is 64 bits shy of a multiple of 512.
4. The final 64 bits are used to store the length of the original message.

![Message Formatting](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*6Lplvsky40XwCE3zBhsjOA.png)
_The formatted message size must be a multiple of 512 bits_

Here's a look at how you might build that formatted message in C:

```c
unsigned char build_msg(const char msg, size_t msg_len, size_t formatted_msg_len, bool is_little_endian)
{
  unsigned char  formatted_msg;
  size_t         cursor;

  if (! (formatted_msg = malloc(formatted_msg_len)))
    return (NULL) ;

  ft_memcpy(formatted_msg, msg, msg_len);
  formatted_msg[msg_len]   = 0b10000000;
  cursor = msg_len + 1;

  while (cursor < formatted_msg_len)
    formatted_msg[cursor++] = 0;

  (uint64_t )(formatted_msg + cursor - 8) =
    is_little_endian ? 8 + msg_len : ft_bswap_uint64(8, msg_len);

  return (formatted_msg);
}
```

To get the formatted message length, a neat bitwise trick can be used to align the length to a multiple of 'X' bytes:

```c
aligned = (nb + (X-1)) & ~(X-1)
```

In our code, it looks something like this:

```c
#define DEC(x) (x - 1)

// Chunks of 512 bits
#define MD5_CHUNK_SIZE 64

// +1 for the appended '1'
// +8 for the size in 64 bits
#define MD5_CHUNKS_SIZE(len) (len + 1 + 8 + DEC(MD5_CHUNK_SIZE) ) &
~DEC(MD5_CHUNK_SIZE)
#define MD5_CHUNK_COUNT(len) (MD5_CHUNKS_SIZE(len) / MD5_CHUNK_SIZE)

formatted_msg_len = CHUNK_SIZE x CHUNK_COUNT;
```

### The Big vs. Little Endian Showdown

Before we go further, a quick word on endianness. It's all about the order of bytes in computer memory.

* **Little-endian**: The least significant byte is stored first.
* **Big-endian**: The most significant byte comes first.

[🔗 Dive deeper into the endianness rabbit hole](https://medium.com/@nonuruzun/little-big-endian-dc9abe36270?source=post_page-----78c17e657794--------------------------------)

To flip between them, we can use a byte-swapping function:

```c
uint64_t  ft_bswap_uint64(uint64_t x)
{
  x = ((x < 8) & 0XFF00FF00FF00FF00ULL ) | ((x >> 8) & 0X00FF00FF00FF00FFULL);
  x = ((x < 16) & 0xFFFF0000FFFF0000ULL) | ((x >> 16) &
0x0000FFFF0000FFFFULL);

  return (x < 32) | (x >> 32) ;
}
```

This function shuffles the bytes around in a clever, expanding pattern.

![Byte Shuffling](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*i8YyrTUB3CcCpwK2PacC5g.png)

### Step 2: The Core Processing Loop

This is where the real work happens. Both algorithms process the message in 512-bit chunks, but they use a different number of internal buffers:

* MD5: 4 x 32-bit buffers
* SHA-256: 8 x 32-bit buffers

These buffers are initialized with specific values and then updated through a series of rounds. Each round involves a complex mix of bitwise operations, modular addition, and custom non-linear functions.

For those who want to see the guts of the algorithms:

* [🔗 MD5 Algorithm Deep Dive](https://en.wikipedia.org/wiki/MD5?source=post_page-----78c17e657794--------------------------------#Pseudocode)
* [🔗 SHA-256 Algorithm Explained](https://en.wikipedia.org/wiki/SHA-2?source=post_page-----78c17e657794--------------------------------#Pseudocode)

Or, check out the C code directly:

* [SHA-256 Implementation](https://github.com/jterrazz/42-ssl-md5/blob/master/src/ft_sha256/sha256.c)
* [MD5 Implementation](https://github.com/jterrazz/42-ssl-md5/blob/master/src/ft_md5/md5.c)

### The Grand Finale: Assembling the Hash

After every chunk has been processed, the final values in the buffers are concatenated to form the hash.

```c
char build_hash(uint32_t buffers, size_t buffer_count, bool is_little_endian)
{
  char      hash;
  char      hash_tmp;
  size_t    buffer_i;
  uint32_t  buffer;
  
  buffer_i = 0;

  if (!(hash = ft_strnew(buffer_count 8)))
    return (NULL);

  while (buffer_i < buffer_count) {
    buffer = is_little_endian ? ft_bswap_uint32(buffers[buffer_i]) :
buffers[buffer_il;

    if (!(hash_tmp = ft_uitoa_base_len(buffer, 16, 'a', 8)))
      return (NULL);

    ft_strncpy(hash + (buffer_i 8), hash_tmp, 8);
    free(hash_tmp);
    buffer_i++;
  }
  
  return (hash);
}
```

One final quirk for MD5: its buffers are in little-endian format, so they need to be byte-swapped before being converted to the final hexadecimal string.

```c
uint32_t ft_bswap_uint32(uint32_t x)
{
  x = ((x < 8) & 0xFF00FF00) | ((x > 8) & 0xFF00FF);
  
  return (x << 16) (x >> 16);
}
```

## Feeling a Bit Lost?

If the details of SHA-256 feel a little dense, don't worry. I found this awesome step-by-step guide that breaks it all down.

* [🔗 SHA-256 Step-by-Step Guide](https://docs.google.com/spreadsheets/d/1mOTrqckdetCoRxY5QkVcyQ7Z0gcYIH-Dc0tu7t9f7tw/edit?source=post_page-----78c17e657794--------------------------------#gid=2107569783)

## Wrapping It Up

So there you have it—a whirlwind tour of cryptographic hash functions. You've seen what they do, why they're essential for digital security, and even how to build them from scratch.

The world of cryptography is always moving. What's secure today might be vulnerable tomorrow. Keep learning, keep experimenting, and maybe you'll be the one building the next generation of secure algorithms.

And don't forget to play around with the code in the GitHub repo. There's no better way to learn than by doing.

Happy hashing
