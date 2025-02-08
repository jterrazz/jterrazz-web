![](assets/thumbnail.jpg)

# Mastering Hash Functions in C: Unraveling the Mysteries of SHA-256 and MD5

**Ever wondered how your online transactions stay secure or how your passwords remain protected?** The secret lies in the world of cryptographic hash functions. Today, we're going to demystify two of the most widely used algorithms: MD5 and SHA-256. Buckle up, because we're about to embark on a thrilling journey into the heart of digital security!

Not only will you gain a deep understanding of these algorithms, but you'll also learn how to implement them yourself in C. And if you're feeling adventurous, we've got a GitHub repository with a complete implementation waiting for you to explore. **Ready to become a cryptography wizard? Let's dive in!**

[🔗 Explore the magical realm of hash functions in our GitHub repository](https://github.com/jterrazz/42-ssl-md5?source=post_page-----78c17e657794--------------------------------)

## 🔐 Cryptographic Functions: The Unsung Heroes of Digital Security

Imagine cryptographic functions as the silent guardians of the digital world. They're the vigilant sentinels that:

- Ensure the **integrity** of your messages and files, making sure they haven't been tampered with.
- Verify passwords **without ever storing them in plain text** (sneaky, right?).
- Create the foundation for **"proof of work"** in cryptocurrencies like Bitcoin and Ethereum.
- Generate and verify **digital signatures**, the virtual equivalent of your handwritten signature.

These digital alchemists take a message of any size and transform it into a fixed-length string of characters, known as a hash. It's like turning a novel into a unique fingerprint! For instance:

- MD5 produces 128-bit hashes (16 characters in hexadecimal)
- SHA-256 creates 256-bit hashes (32 characters in hexadecimal)

![Hash Function Visualization](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*aZh9gQlawdGcwSrCO0KOeA.png)

### The Superpowers of Cryptographic Hash Functions

These functions possess some truly remarkable properties:

1. **Determinism**: Like a loyal friend, they always produce the same output for the same input.
2. **Speed**: They're the Usain Bolt of algorithms, computing hashes quickly for inputs of any size.
3. **One-wayness**: They're master illusionists–you can't determine the input from the hash.
4. **Collision resistance**: It's practically impossible to find two inputs that produce the same hash.
5. **Avalanche effect**: A tiny change in input causes a dramatically different hash, like a butterfly effect for data.

These properties make hash functions the Swiss Army knife of cryptography, ready for a variety of security applications.

## The Contenders: MD5 Vs SHA-256

### MD5: The Retired Veteran

MD5, once a stalwart in the cryptographic world, is now like a retired superhero. While it's no longer considered secure for cryptographic purposes (due to some sneaky vulnerabilities), it still has its uses:

- Checking file integrity against unintentional corruption
- Non-security-critical applications where speed is more important than bulletproof security

Remember: **MD5 should never be used for security-critical applications**. It's like using a plastic sword in a real duel–not a great idea!

### SHA-256: The Modern Guardian

SHA-256, part of the SHA-2 family, is the cool younger cousin of MD5. It was developed to address the weaknesses of its predecessors (SHA-1 and SHA-0), which themselves were inspired by MD5. Talk about a family tree of algorithms!

SHA-256 is considered secure because:

- It's computationally infeasible to reverse-engineer the input from the hash.
- It has strong collision resistance.

However, it's not recommended for password storage in databases. Why? It's a bit too quick for its own good, making it vulnerable to brute-force and [rainbow table attacks](https://en.wikipedia.org/wiki/Rainbow_table). In the world of password hashing, slower can sometimes be safer!

## The Inner Workings: A Peek Behind the Cryptographic Curtain

### Step 1: Preparing the Stage (Formatting the Input)

Before the main show begins, we need to set the stage. The input message needs to be formatted to meet specific criteria:

1. The message is divided into **512-bit chunks**.
2. A "1" bit is added at the end of the message.
3. "0" bits are added to make the length a multiple of (512-64) bits.
4. The original message length is stored in the last 64 bits.

![Message Formatting](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*6Lplvsky40XwCE3zBhsjOA.png)
_The formatted message size must be a multiple of 512 bits_

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

To calculate the formatted message length, we use this magical formula:

```c
aligned = (nb + (X-1)) & ~(X-1)
```

This aligns our number 'nb' to a multiple of 'X' bytes. It's like making sure everyone in a marching band is in perfect rows!

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

### The Endianness Enigma: Little & Big Endian

Before we dive deeper, let's talk about endianness–the order in which bytes are arranged in computer memory. It's like the difference between reading a book left-to-right or right-to-left.

- **Little-endian**: The least significant byte comes first.
- **Big-endian**: The most significant byte comes first.

[🔗 Dive deeper into the endianness rabbit hole](https://medium.com/@nonuruzun/little-big-endian-dc9abe36270?source=post_page-----78c17e657794--------------------------------)

To convert between these two, we use a bit of binary magic:

```c
uint64_t  ft_bswap_uint64(uint64_t x)
{
  x = ((x < 8) & 0XFF00FF00FF00FF00ULL ) | ((x >> 8) & 0X00FF00FF00FF00FFULL);
  x = ((x < 16) & 0xFFFF0000FFFF0000ULL) | ((x >> 16) &
0x0000FFFF0000FFFFULL);

  return (x < 32) | (x >> 32) ;
}
```

This shuffling algorithm works by swapping bytes, starting with small groups and progressively expanding. It's like a choreographed dance of bits!

![Byte Shuffling](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*i8YyrTUB3CcCpwK2PacC5g.png)

### Step 2: The Grand Shuffle (Data Processing)

Now comes the main event! Both MD5 and SHA-256 divide the message into 512-bit chunks and perform a series of mathematical operations on them.

- MD5 uses 4 32-bit buffers
- SHA-256 uses 8 32-bit buffers

These buffers are like jugglers, constantly tossing and catching data bits in a mesmerizing performance. The exact steps differ between MD5 and SHA-256, but both involve a complex dance of bitwise operations, modular additions, and nonlinear functions.

For the brave souls who want to dive into the nitty-gritty details:

- [🔗 MD5 Algorithm Deep Dive](https://en.wikipedia.org/wiki/MD5?source=post_page-----78c17e657794--------------------------------#Pseudocode)
- [🔗 SHA-256 Algorithm Explained](https://en.wikipedia.org/wiki/SHA-2?source=post_page-----78c17e657794--------------------------------#Pseudocode)

Or, if you prefer to see the algorithms in action, check out our implementations:

- [SHA-256 Implementation](https://github.com/jterrazz/42-ssl-md5/blob/master/src/ft_sha256/sha256.c)
- [MD5 Implementation](https://github.com/jterrazz/42-ssl-md5/blob/master/src/ft_md5/md5.c)

### The Grand Finale: Building the Hash

After all the shuffling and juggling, we're left with 4 (for MD5) or 8 (for SHA-256) buffers. These buffers are the raw ingredients for our final hash.

To create the hash, we simply concatenate these buffers in their hexadecimal form. It's like assembling a puzzle where each piece is a part of the final secret code!

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

One last twist for MD5: the buffers are in little-endian format, so we need to flip them before printing. It's like reading the last page of a book first!

```c
uint32_t ft_bswap_uint32(uint32_t x)
{
  x = ((x < 8) & 0xFF00FF00) | ((x > 8) & 0xFF00FF);
  
  return (x << 16) (x >> 16);
}
```

## Need a Helping Hand?

If you're feeling overwhelmed by SHA-256, fear not! We've got a step-by-step guide that breaks down the process into manageable chunks:

- [🔗 SHA-256 Step-by-Step Guide](https://docs.google.com/spreadsheets/d/1mOTrqckdetCoRxY5QkVcyQ7Z0gcYIH-Dc0tu7t9f7tw/edit?source=post_page-----78c17e657794--------------------------------#gid=2107569783)

## Wrapping Up

Congratulations! You've just taken a deep dive into the fascinating world of cryptographic hash functions. From understanding their crucial role in digital security to unraveling the inner workings of MD5 and SHA-256, you're now equipped with knowledge that puts you ahead of the curve.

Remember, the world of cryptography is vast and ever-evolving. This tutorial is just the beginning of your journey. Keep exploring, keep learning, and who knows? You might be the one to develop the next groundbreaking hash function!

If you're itching to see these concepts in action, don't forget to check out our GitHub repository. It's packed with complete implementations that you can tinker with and learn from.

Happy hashing, and may your digital adventures be secure and exciting!
