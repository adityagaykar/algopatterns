const problems = [
// ============================================================
// CATEGORY: TWO POINTERS (Problems 1-5)
// ============================================================
{
    id: 1,
    lcNumber: 11,
    title: "Container With Most Water",
    difficulty: "Medium",
    category: "Two Pointers",
    description: "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the i-th line are `(i, 0)` and `(i, height[i])`. Find two lines that together with the x-axis form a container that holds the most water. Return the maximum amount of water a container can store.",
    examples: [
        "Input: height = [1,8,6,2,5,4,8,3,7]\nOutput: 49\nExplanation: Lines at index 1 (h=8) and index 8 (h=7) form area = min(8,7) * (8-1) = 49.",
        "Input: height = [1,1]\nOutput: 1"
    ],
    thinkingProcess: [
        { step: "Understand the problem visually", detail: "Imagine vertical bars on a number line. Pick two bars as container sides. Water held = `min(height[left], height[right]) * (right - left)`. Maximize this." },
        { step: "Consider brute force", detail: "Try every pair — O(n²). For each pair (i,j), compute area. Works but too slow. Can we do better?" },
        { step: "Observe what determines area", detail: "Area depends on width `(right - left)` AND height `min(height[left], height[right])`. Starting with maximum width (both ends), the only way to increase area is finding a taller shorter-side." },
        { step: "Develop two-pointer strategy", detail: "Start pointers at both ends. The shorter line limits the area. Moving the shorter pointer inward might find a taller line. Moving the taller pointer can NEVER help — width shrinks and height stays limited by the short side." },
        { step: "Verify correctness", detail: "When we move the shorter pointer, we discard it. Safe? Yes — pairing it with ANY inner line gives less area (smaller width, same or smaller limiting height). Nothing is lost." },
        { step: "Trace through example", detail: "height=[1,8,6,2,5,4,8,3,7]. L=0,R=8: area=min(1,7)*8=8, move L. L=1,R=8: area=min(8,7)*7=49, move R. Continue... max stays 49." }
    ],
    keyInsight: "Start with the widest container (pointers at both ends). Always move the pointer pointing to the shorter line inward — that's the only move that could potentially find a larger area.",
    approach: "Two pointers at both ends. Calculate area each step. Move the shorter-height pointer inward. Track max area. Continue until pointers meet.",
    solutionPython: `def maxArea(height):
    left, right = 0, len(height) - 1
    max_area = 0
    
    while left < right:
        width = right - left
        h = min(height[left], height[right])
        max_area = max(max_area, width * h)
        
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    
    return max_area`,
    solutionCpp: `int maxArea(vector<int>& height) {
    int left = 0, right = height.size() - 1;
    int maxArea = 0;
    
    while (left < right) {
        int w = right - left;
        int h = min(height[left], height[right]);
        maxArea = max(maxArea, w * h);
        
        if (height[left] < height[right])
            left++;
        else
            right--;
    }
    return maxArea;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    patternGuide: "Use **two-pointer from both ends** when:\n- You need to find an optimal pair in a positional array\n- The problem involves maximizing/minimizing a function of two elements\n- Moving one pointer can provably eliminate suboptimal candidates\n\nSimilar: Trapping Rain Water, Two Sum II"
},
{
    id: 2,
    lcNumber: 15,
    title: "3Sum",
    difficulty: "Medium",
    category: "Two Pointers",
    description: "Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, `j != k`, and `nums[i] + nums[j] + nums[k] == 0`. The solution set must not contain duplicate triplets.",
    examples: [
        "Input: nums = [-1,0,1,2,-1,-4]\nOutput: [[-1,-1,2],[-1,0,1]]",
        "Input: nums = [0,0,0]\nOutput: [[0,0,0]]"
    ],
    thinkingProcess: [
        { step: "Reduce to a known problem", detail: "3Sum: find a,b,c where a+b+c=0. Rearranging: b+c = -a. For each element `a`, we need two numbers summing to `-a`. That's Two Sum! If sorted, we solve Two Sum in O(n) with two pointers." },
        { step: "Sort the array first", detail: "Sorting gives two benefits: (1) two-pointer technique for the inner Two Sum, (2) easy duplicate skipping by checking if current equals previous." },
        { step: "Handle duplicates carefully", detail: "After sorting, if `nums[i] == nums[i-1]`, skip `i`. Inside the two-pointer loop, after finding a valid triplet, skip `left` and `right` past duplicates too." },
        { step: "Optimize with early termination", detail: "If `nums[i] > 0`, break — all remaining elements are positive, so no triplet can sum to zero." },
        { step: "Trace through example", detail: "Sort: [-4,-1,-1,0,1,2]. i=0(a=-4): need b+c=4, no match. i=1(a=-1): need 1, L=2,R=5: -1+2=1 ✓ → [-1,-1,2]. L=3,R=4: 0+1=1 ✓ → [-1,0,1]. i=2: same as i=1, skip." }
    ],
    keyInsight: "Sort the array, then reduce 3Sum to multiple Two Sum problems. For each `nums[i]`, use two pointers on the remaining subarray to find pairs summing to `-nums[i]`. Skip duplicates at every level.",
    approach: "1. Sort array. 2. For each `i`, set target = `-nums[i]`. 3. Two pointers `left=i+1`, `right=n-1` find pairs. 4. Skip duplicate values everywhere.",
    solutionPython: `def threeSum(nums):
    nums.sort()
    result = []
    
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        if nums[i] > 0:
            break
        
        left, right = i + 1, len(nums) - 1
        target = -nums[i]
        
        while left < right:
            total = nums[left] + nums[right]
            if total == target:
                result.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1
            elif total < target:
                left += 1
            else:
                right -= 1
    
    return result`,
    solutionCpp: `vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> result;
    
    for (int i = 0; i < (int)nums.size() - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        if (nums[i] > 0) break;
        
        int left = i + 1, right = nums.size() - 1;
        int target = -nums[i];
        
        while (left < right) {
            int sum = nums[left] + nums[right];
            if (sum == target) {
                result.push_back({nums[i], nums[left], nums[right]});
                while (left < right && nums[left] == nums[left + 1]) left++;
                while (left < right && nums[right] == nums[right - 1]) right--;
                left++; right--;
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
    }
    return result;
}`,
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1) excluding output",
    patternGuide: "Use **sort + fix one + two-pointer** when:\n- Finding k elements satisfying a sum condition (k ≥ 3)\n- Duplicate handling is required\n- The problem decomposes into nested Two Sum\n\nSimilar: 4Sum, 3Sum Closest, Two Sum II"
},
{
    id: 3,
    lcNumber: 42,
    title: "Trapping Rain Water",
    difficulty: "Hard",
    category: "Two Pointers",
    description: "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    examples: [
        "Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]\nOutput: 6",
        "Input: height = [4,2,0,3,2,5]\nOutput: 9"
    ],
    thinkingProcess: [
        { step: "Water per position", detail: "At index `i`, water level = `min(maxLeft, maxRight)`. Water trapped = `max(0, min(maxLeft, maxRight) - height[i])`. We need max heights on both sides for every position." },
        { step: "Brute force → prefix arrays", detail: "For each index, scan left/right to find max: O(n²). Better: precompute prefix-max and suffix-max arrays → O(n) time, O(n) space." },
        { step: "Can we do O(1) space?", detail: "Yes! Key insight: we don't need BOTH maxLeft and maxRight exactly. We only need `min(maxLeft, maxRight)`. If `maxLeft < maxRight`, water at left pointer is determined entirely by maxLeft." },
        { step: "Two-pointer logic", detail: "Maintain `left`, `right`, `maxLeft`, `maxRight`. If `height[left] <= height[right]`: right side is at least as tall, so maxLeft determines water at left. Update maxLeft, add water, move left." },
        { step: "Why this works", detail: "When `height[left] <= height[right]`, a bar at `right` is ≥ `height[left]`. The actual max on right ≥ `height[right]`. So the bottleneck is maxLeft, which we track exactly." },
        { step: "Trace through", detail: "height=[0,1,0,2,1,0,1,3,2,1,2,1]. L=0,R=11. Process from both sides, accumulating water where the shorter-max side is. Total = 6." }
    ],
    keyInsight: "Water at any position = `min(maxLeft, maxRight) - height[i]`. With two pointers, process the side with the smaller max first — the other side is guaranteed taller, so we know the exact water level.",
    approach: "Two pointers from both ends. Track maxLeft and maxRight. Always process the side with smaller height. Water at that position = max minus current height.",
    solutionPython: `def trap(height):
    if not height:
        return 0
    
    left, right = 0, len(height) - 1
    max_left, max_right = 0, 0
    water = 0
    
    while left < right:
        if height[left] <= height[right]:
            max_left = max(max_left, height[left])
            water += max_left - height[left]
            left += 1
        else:
            max_right = max(max_right, height[right])
            water += max_right - height[right]
            right -= 1
    
    return water`,
    solutionCpp: `int trap(vector<int>& height) {
    if (height.empty()) return 0;
    
    int left = 0, right = height.size() - 1;
    int maxLeft = 0, maxRight = 0;
    int water = 0;
    
    while (left < right) {
        if (height[left] <= height[right]) {
            maxLeft = max(maxLeft, height[left]);
            water += maxLeft - height[left];
            left++;
        } else {
            maxRight = max(maxRight, height[right]);
            water += maxRight - height[right];
            right--;
        }
    }
    return water;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    patternGuide: "Use **two-pointer with running max** when:\n- Each position depends on global info from both directions\n- Constraint decomposes into `min(leftInfo, rightInfo)`\n- Processing the smaller side first gives exact answer\n\nSimilar: Container With Most Water, Largest Rectangle in Histogram"
},
{
    id: 4,
    lcNumber: 31,
    title: "Next Permutation",
    difficulty: "Medium",
    category: "Two Pointers",
    description: "The next permutation of an array of integers is the next lexicographically greater permutation. If the array is the last permutation, return the first permutation (sorted ascending). The replacement must be in place with constant extra memory.",
    examples: [
        "Input: nums = [1,2,3]\nOutput: [1,3,2]",
        "Input: nums = [3,2,1]\nOutput: [1,2,3]",
        "Input: nums = [1,1,5]\nOutput: [1,5,1]"
    ],
    thinkingProcess: [
        { step: "Understand lexicographic order", detail: "Think of numbers as dictionary words. [1,2,3] < [1,3,2] < [2,1,3] < ... < [3,2,1]. We need the NEXT one. If it's the last (fully descending), wrap to first." },
        { step: "Find the rightmost ascent", detail: "Scan from the right. Find first index `i` where `nums[i] < nums[i+1]`. Everything right of `i` is descending (already largest permutation of those digits). Position `i` is where we make a change." },
        { step: "Why this position?", detail: "If suffix `nums[i+1:]` is descending, no rearrangement of just the suffix can make it larger. We MUST change `nums[i]` to something slightly bigger." },
        { step: "Find the swap target", detail: "Scan suffix from right. Find first `nums[j] > nums[i]`. Since suffix is descending, this is the smallest value greater than `nums[i]`. Swap them." },
        { step: "Reverse the suffix", detail: "After swapping, suffix is still descending. Reverse it to make it ascending — the smallest possible tail. This produces the very next permutation." },
        { step: "Edge case", detail: "If no `i` found (entire array descending), just reverse the whole array to get the first permutation." }
    ],
    keyInsight: "Find the rightmost 'dip' where `nums[i] < nums[i+1]`. Swap `nums[i]` with the next-larger element in the descending suffix. Reverse the suffix. This is the minimal increment to the next permutation.",
    approach: "1. Find largest `i` with `nums[i] < nums[i+1]`. 2. Find largest `j > i` with `nums[j] > nums[i]`. 3. Swap. 4. Reverse from `i+1` to end.",
    solutionPython: `def nextPermutation(nums):
    n = len(nums)
    i = n - 2
    while i >= 0 and nums[i] >= nums[i + 1]:
        i -= 1
    
    if i >= 0:
        j = n - 1
        while nums[j] <= nums[i]:
            j -= 1
        nums[i], nums[j] = nums[j], nums[i]
    
    # Reverse suffix
    left, right = i + 1, n - 1
    while left < right:
        nums[left], nums[right] = nums[right], nums[left]
        left += 1
        right -= 1`,
    solutionCpp: `void nextPermutation(vector<int>& nums) {
    int n = nums.size();
    int i = n - 2;
    while (i >= 0 && nums[i] >= nums[i + 1])
        i--;
    
    if (i >= 0) {
        int j = n - 1;
        while (nums[j] <= nums[i])
            j--;
        swap(nums[i], nums[j]);
    }
    
    reverse(nums.begin() + i + 1, nums.end());
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    patternGuide: "Use **scan-from-right + reversal** when:\n- Finding next/previous in a combinatorial sequence\n- Lexicographic ordering problems\n- Minimal modification to an arrangement\n\nSimilar: Permutations, Permutation Sequence"
},
{
    id: 5,
    lcNumber: 75,
    title: "Sort Colors",
    difficulty: "Medium",
    category: "Two Pointers",
    description: "Given an array `nums` with objects colored red (0), white (1), or blue (2), sort them in-place so that same colors are adjacent in order red, white, blue. Solve it in one pass without using sort.",
    examples: [
        "Input: nums = [2,0,2,1,1,0]\nOutput: [0,0,1,1,2,2]",
        "Input: nums = [2,0,1]\nOutput: [0,1,2]"
    ],
    thinkingProcess: [
        { step: "Only 3 distinct values", detail: "This is the Dutch National Flag problem (Dijkstra). Partition the array into three sections: [all 0s | all 1s | all 2s]." },
        { step: "Three-pointer partition", detail: "Use `low` (boundary for 0s), `mid` (current element), `high` (boundary for 2s). Invariant: everything before low is 0, between low and mid is 1, after high is 2." },
        { step: "Process by current value", detail: "If `nums[mid]==0`: swap with low, advance both. If `nums[mid]==1`: advance mid. If `nums[mid]==2`: swap with high, decrement high only." },
        { step: "Why not advance mid on swap with high?", detail: "Element from high is unknown — could be 0, 1, or 2. Must examine again. Element from low is guaranteed 1 (mid already passed it), so safe to advance." },
        { step: "Trace through", detail: "[2,0,2,1,1,0] → swap mid/high → [0,0,2,1,1,2] → process 0s → [0,0,2,1,1,2] → swap mid/high → [0,0,1,1,2,2]. Done." }
    ],
    keyInsight: "Dutch National Flag: three pointers partition the array into three regions in a single pass. Send 0s left, 2s right, 1s stay in middle. Don't advance mid after swapping with high (unknown element).",
    approach: "Three pointers: low=0, mid=0, high=n-1. While mid ≤ high: if 0, swap with low and advance both; if 1, advance mid; if 2, swap with high, decrement high only.",
    solutionPython: `def sortColors(nums):
    low, mid, high = 0, 0, len(nums) - 1
    
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1`,
    solutionCpp: `void sortColors(vector<int>& nums) {
    int low = 0, mid = 0, high = nums.size() - 1;
    
    while (mid <= high) {
        if (nums[mid] == 0) {
            swap(nums[low], nums[mid]);
            low++; mid++;
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            swap(nums[mid], nums[high]);
            high--;
        }
    }
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    patternGuide: "Use **Dutch National Flag / three-way partition** when:\n- Partitioning into exactly 3 groups\n- One-pass in-place sorting with limited values\n- Quicksort partition around a pivot\n\nSimilar: Move Zeroes, Wiggle Sort"
},
// ============================================================
// CATEGORY: SLIDING WINDOW (Problems 6-10)
// ============================================================
{
    id: 6,
    lcNumber: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "Sliding Window",
    description: "Given a string `s`, find the length of the longest substring without repeating characters.",
    examples: [
        "Input: s = \"abcabcbb\"\nOutput: 3\nExplanation: The answer is \"abc\", with length 3.",
        "Input: s = \"bbbbb\"\nOutput: 1",
        "Input: s = \"pwwkew\"\nOutput: 3\nExplanation: The answer is \"wke\"."
    ],
    thinkingProcess: [
        { step: "Understand the constraint", detail: "We need a contiguous substring (not subsequence) where every character is unique. We want the longest such substring." },
        { step: "Brute force", detail: "Check every substring and verify uniqueness: O(n³). Can we use the structure of the problem to do better?" },
        { step: "Recognize the sliding window pattern", detail: "We maintain a window [left, right] that always contains unique characters. Expand right to include new chars. When a duplicate is found, shrink from the left until the window is valid again." },
        { step: "Use a hash map for O(1) lookups", detail: "Store the last seen index of each character. When we encounter `s[right]` that's already in our window, we can jump `left` directly to `lastSeen[s[right]] + 1` instead of moving one step at a time." },
        { step: "Track the maximum", detail: "At each step, the window [left, right] is valid. Update max_length = max(max_length, right - left + 1)." },
        { step: "Trace through", detail: "s=\"abcabcbb\". right=0:'a'→{a:0},len=1. right=1:'b'→{a:0,b:1},len=2. right=2:'c'→len=3. right=3:'a' seen at 0, left=1→len=3. right=4:'b' seen at 1, left=2→len=3. Max=3." }
    ],
    keyInsight: "Use a sliding window with a hash map tracking each character's last position. When a duplicate is found, jump the left pointer past the previous occurrence — no need to shrink one-by-one.",
    approach: "Expand window right. If char already in window, move left past its last occurrence. Update max length each step. Hash map stores char → last index.",
    solutionPython: `def lengthOfLongestSubstring(s):
    char_index = {}
    left = 0
    max_len = 0
    
    for right in range(len(s)):
        if s[right] in char_index and char_index[s[right]] >= left:
            left = char_index[s[right]] + 1
        char_index[s[right]] = right
        max_len = max(max_len, right - left + 1)
    
    return max_len`,
    solutionCpp: `int lengthOfLongestSubstring(string s) {
    unordered_map<char, int> charIndex;
    int left = 0, maxLen = 0;
    
    for (int right = 0; right < s.size(); right++) {
        if (charIndex.count(s[right]) && charIndex[s[right]] >= left) {
            left = charIndex[s[right]] + 1;
        }
        charIndex[s[right]] = right;
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(min(n, m)) where m = charset size",
    patternGuide: "Use **sliding window with hash map** when:\n- Finding longest/shortest substring with a constraint\n- The constraint involves uniqueness or frequency\n- You can define a valid window and expand/shrink it\n\nSimilar: Minimum Window Substring, Longest Repeating Character Replacement"
},
{
    id: 7,
    lcNumber: 76,
    title: "Minimum Window Substring",
    difficulty: "Hard",
    category: "Sliding Window",
    description: "Given two strings `s` and `t`, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string.",
    examples: [
        "Input: s = \"ADOBECODEBANC\", t = \"ABC\"\nOutput: \"BANC\"\nExplanation: The minimum window containing A, B, C is \"BANC\".",
        "Input: s = \"a\", t = \"a\"\nOutput: \"a\""
    ],
    thinkingProcess: [
        { step: "Define what 'valid window' means", detail: "A window in `s` is valid if it contains all characters of `t` with at least the required frequency. E.g., if t=\"ABC\", the window must have ≥1 A, ≥1 B, ≥1 C." },
        { step: "Expand to find a valid window", detail: "Move `right` pointer to expand the window until it contains all chars of `t`. Use a frequency map for `t` and a counter for how many chars are satisfied." },
        { step: "Shrink to minimize", detail: "Once valid, try to shrink from the left. Move `left` forward while the window remains valid. Track the minimum valid window seen." },
        { step: "Use 'formed' counter for efficiency", detail: "Instead of comparing full frequency maps each time (expensive), maintain a `formed` counter: number of unique chars in `t` that have the required frequency in the current window. Window is valid when `formed == required`." },
        { step: "Optimize the shrink step", detail: "When removing `s[left]` from the window: decrement its count. If its count drops below what `t` requires, decrement `formed`. This tells us instantly if the window became invalid." },
        { step: "Trace through", detail: "s=\"ADOBECODEBANC\", t=\"ABC\". Expand until we have A,B,C → \"ADOBEC\"(len 6). Shrink: remove A → invalid. Record min. Continue expanding... Eventually find \"BANC\"(len 4). Min = \"BANC\"." }
    ],
    keyInsight: "Expand the window until valid (contains all of `t`), then shrink from the left to minimize. Use a `formed` counter comparing satisfied characters against required unique characters for O(1) validity checking.",
    approach: "1. Count char frequencies in `t`. 2. Expand right to include chars. 3. When window is valid (`formed == required`), shrink left and track minimum. 4. Return smallest valid window.",
    solutionPython: `def minWindow(s, t):
    if not t or not s:
        return ""
    
    from collections import Counter
    t_count = Counter(t)
    required = len(t_count)
    
    left = 0
    formed = 0
    window_counts = {}
    min_len = float('inf')
    min_left = 0
    
    for right in range(len(s)):
        char = s[right]
        window_counts[char] = window_counts.get(char, 0) + 1
        
        if char in t_count and window_counts[char] == t_count[char]:
            formed += 1
        
        while formed == required:
            # Update minimum
            if right - left + 1 < min_len:
                min_len = right - left + 1
                min_left = left
            
            # Shrink from left
            left_char = s[left]
            window_counts[left_char] -= 1
            if left_char in t_count and window_counts[left_char] < t_count[left_char]:
                formed -= 1
            left += 1
    
    return "" if min_len == float('inf') else s[min_left:min_left + min_len]`,
    solutionCpp: `string minWindow(string s, string t) {
    unordered_map<char, int> tCount, windowCount;
    for (char c : t) tCount[c]++;
    
    int required = tCount.size();
    int formed = 0;
    int left = 0, minLen = INT_MAX, minLeft = 0;
    
    for (int right = 0; right < s.size(); right++) {
        windowCount[s[right]]++;
        if (tCount.count(s[right]) && 
            windowCount[s[right]] == tCount[s[right]])
            formed++;
        
        while (formed == required) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                minLeft = left;
            }
            windowCount[s[left]]--;
            if (tCount.count(s[left]) && 
                windowCount[s[left]] < tCount[s[left]])
                formed--;
            left++;
        }
    }
    return minLen == INT_MAX ? "" : s.substr(minLeft, minLen);
}`,
    timeComplexity: "O(|s| + |t|)",
    spaceComplexity: "O(|s| + |t|)",
    patternGuide: "Use **sliding window with frequency map** when:\n- Finding minimum/maximum substring containing required elements\n- Window validity depends on character frequencies\n- You need 'formed' vs 'required' counting trick\n\nSimilar: Find All Anagrams, Permutation in String, Substring with Concatenation"
},
{
    id: 8,
    lcNumber: 239,
    title: "Sliding Window Maximum",
    difficulty: "Hard",
    category: "Sliding Window",
    description: "You are given an array of integers `nums` and a sliding window of size `k` which moves from the very left to the very right. You can only see the `k` numbers in the window. Each time the window moves right by one position, return the max in each window.",
    examples: [
        "Input: nums = [1,3,-1,-3,5,3,6,7], k = 3\nOutput: [3,3,5,5,6,7]\nExplanation: Window [1,3,-1]=3, [3,-1,-3]=3, [-1,-3,5]=5, [-3,5,3]=5, [5,3,6]=6, [3,6,7]=7",
        "Input: nums = [1], k = 1\nOutput: [1]"
    ],
    thinkingProcess: [
        { step: "Brute force", detail: "For each window position, scan k elements to find max: O(nk). We need O(n). What data structure gives us max efficiently as elements enter and leave?" },
        { step: "Consider a max-heap?", detail: "Heap gives max in O(1), but removing arbitrary elements (when they leave the window) is O(k). Not ideal." },
        { step: "Monotonic deque insight", detail: "We need a deque that maintains elements in decreasing order. The front is always the maximum. When a new element comes in, remove all smaller elements from the back — they can never be the answer (the new element is newer AND larger)." },
        { step: "Handle window boundaries", detail: "Store indices (not values) in the deque. Before processing each element, check if the front index is outside the window (`deque[0] <= i - k`). If so, pop it from the front." },
        { step: "Why monotonic works", detail: "If nums[j] >= nums[i] and j > i, then nums[i] can never be the maximum for any future window containing both. So we discard nums[i]. The deque always holds potential max candidates in decreasing order." },
        { step: "Trace through", detail: "nums=[1,3,-1,-3,5,3,6,7], k=3. i=0: deq=[0]. i=1: 3>1, pop 0, deq=[1]. i=2: deq=[1,2], output nums[1]=3. i=3: deq=[1,2,3], pop front 1 (outside), deq=[2,3], output 3? No, nums[2]=-1. Actually deq=[1,2,3] → front=1, window [1,3], output nums[1]=3." }
    ],
    keyInsight: "Use a monotonic decreasing deque storing indices. The front is always the window maximum. When adding a new element, pop all smaller elements from back (they're obsolete). Pop from front if outside window.",
    approach: "Maintain a deque of indices in decreasing order of values. For each element: (1) remove out-of-window indices from front, (2) remove smaller elements from back, (3) push current index, (4) record front as max.",
    solutionPython: `from collections import deque

def maxSlidingWindow(nums, k):
    dq = deque()  # stores indices
    result = []
    
    for i in range(len(nums)):
        # Remove indices outside the window
        while dq and dq[0] <= i - k:
            dq.popleft()
        
        # Remove smaller elements from back
        while dq and nums[dq[-1]] <= nums[i]:
            dq.pop()
        
        dq.append(i)
        
        # Window is fully formed starting at index k-1
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result`,
    solutionCpp: `vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    deque<int> dq; // stores indices
    vector<int> result;
    
    for (int i = 0; i < nums.size(); i++) {
        // Remove out-of-window indices
        while (!dq.empty() && dq.front() <= i - k)
            dq.pop_front();
        
        // Remove smaller elements from back
        while (!dq.empty() && nums[dq.back()] <= nums[i])
            dq.pop_back();
        
        dq.push_back(i);
        
        if (i >= k - 1)
            result.push_back(nums[dq.front()]);
    }
    return result;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(k)",
    patternGuide: "Use **monotonic deque** when:\n- You need min/max in a sliding window\n- Elements enter from one side and leave from the other\n- You need to efficiently maintain ordering as window shifts\n\nSimilar: Shortest Subarray with Sum at Least K, Constrained Subsequence Sum"
},
{
    id: 9,
    lcNumber: 438,
    title: "Find All Anagrams in a String",
    difficulty: "Medium",
    category: "Sliding Window",
    description: "Given two strings `s` and `p`, return an array of all the start indices of `p`'s anagrams in `s`. An anagram is a rearrangement of all characters. You may return the answer in any order.",
    examples: [
        "Input: s = \"cbaebabacd\", p = \"abc\"\nOutput: [0,6]\nExplanation: \"cba\" at index 0 and \"bac\" at index 6 are anagrams of \"abc\".",
        "Input: s = \"abab\", p = \"ab\"\nOutput: [0,1,2]"
    ],
    thinkingProcess: [
        { step: "What defines an anagram?", detail: "An anagram of `p` is any substring of `s` with the same character frequencies as `p`. We need all starting indices of such substrings." },
        { step: "Fixed-size sliding window", detail: "Since all anagrams have length `len(p)`, we use a fixed-size window of that length sliding across `s`. This is simpler than variable-size windows." },
        { step: "Frequency comparison", detail: "Maintain a frequency count for the current window. Compare with `p`'s frequency count. If equal, record the start index." },
        { step: "Optimize with a 'matches' counter", detail: "Instead of comparing 26-element arrays each time, track how many of the 26 characters have matching frequencies. When `matches == 26`, it's an anagram." },
        { step: "Update efficiently as window slides", detail: "When adding char at right: increment window count. If it now matches p's count, increment matches. If it was matching before but now overshoots, decrement matches. Mirror for removing char at left." },
        { step: "Trace through", detail: "s=\"cbaebabacd\", p=\"abc\". Window \"cba\": freq matches \"abc\" ✓ → index 0. Slide: \"bae\" ✗, \"aeb\" ✗, \"eba\" ✗, \"bab\" ✗, \"aba\" ✗, \"bac\" ✓ → index 6." }
    ],
    keyInsight: "Fixed-size sliding window of length `len(p)`. Track a `matches` counter across 26 characters so checking is O(1) per slide instead of O(26). Increment/decrement matches as characters enter/leave.",
    approach: "1. Count p's frequencies. 2. Initialize window with first len(p) chars. 3. Slide right by 1 each step: add new char, remove old char, update matches. 4. When matches==26, record index.",
    solutionPython: `def findAnagrams(s, p):
    if len(p) > len(s):
        return []
    
    p_count = [0] * 26
    s_count = [0] * 26
    result = []
    
    for c in p:
        p_count[ord(c) - ord('a')] += 1
    
    for i in range(len(s)):
        # Add right char
        s_count[ord(s[i]) - ord('a')] += 1
        
        # Remove left char when window exceeds size
        if i >= len(p):
            s_count[ord(s[i - len(p)]) - ord('a')] -= 1
        
        # Compare
        if s_count == p_count:
            result.append(i - len(p) + 1)
    
    return result`,
    solutionCpp: `vector<int> findAnagrams(string s, string p) {
    if (p.size() > s.size()) return {};
    
    vector<int> pCount(26, 0), sCount(26, 0);
    vector<int> result;
    
    for (char c : p) pCount[c - 'a']++;
    
    for (int i = 0; i < s.size(); i++) {
        sCount[s[i] - 'a']++;
        if (i >= (int)p.size())
            sCount[s[i - p.size()] - 'a']--;
        if (sCount == pCount)
            result.push_back(i - p.size() + 1);
    }
    return result;
}`,
    timeComplexity: "O(n) where n = len(s)",
    spaceComplexity: "O(1) — fixed 26-char arrays",
    patternGuide: "Use **fixed-size sliding window with frequency array** when:\n- Looking for permutations/anagrams in a string\n- Window size is known and fixed\n- Comparison can be done via frequency matching\n\nSimilar: Permutation in String, Minimum Window Substring"
},
{
    id: 10,
    lcNumber: 567,
    title: "Permutation in String",
    difficulty: "Medium",
    category: "Sliding Window",
    description: "Given two strings `s1` and `s2`, return `true` if `s2` contains a permutation of `s1`. In other words, return `true` if one of `s1`'s permutations is a substring of `s2`.",
    examples: [
        "Input: s1 = \"ab\", s2 = \"eidbaooo\"\nOutput: true\nExplanation: s2 contains \"ba\" which is a permutation of \"ab\".",
        "Input: s1 = \"ab\", s2 = \"eidboaoo\"\nOutput: false"
    ],
    thinkingProcess: [
        { step: "Reframe the problem", detail: "A permutation of s1 as a substring of s2 means: there exists a contiguous window in s2 of length len(s1) with the exact same character frequencies as s1. Identical to finding one anagram." },
        { step: "Fixed-size window", detail: "Slide a window of size `len(s1)` over `s2`. At each position, check if the window's character frequencies match s1's." },
        { step: "Matches counter optimization", detail: "Track how many of the 26 characters currently have matching frequencies between the window and s1. When all 26 match, return true." },
        { step: "Incremental updates", detail: "When adding a char to the window: if it causes a match, increment matches; if it breaks a match, decrement. Same when removing a char. This makes each slide O(1)." },
        { step: "Early termination", detail: "Return true as soon as matches == 26. No need to process the rest of s2. Worst case we check the entire string and return false." }
    ],
    keyInsight: "This is exactly 'Find All Anagrams' but returning boolean instead of indices. Fixed-size sliding window with a matches counter across 26 characters. Return true the moment all 26 match.",
    approach: "Count s1 frequencies. Slide window of size len(s1) over s2. Track matches counter for all 26 chars. Return true when matches == 26.",
    solutionPython: `def checkInclusion(s1, s2):
    if len(s1) > len(s2):
        return False
    
    s1_count = [0] * 26
    s2_count = [0] * 26
    
    for c in s1:
        s1_count[ord(c) - ord('a')] += 1
    
    for i in range(len(s2)):
        s2_count[ord(s2[i]) - ord('a')] += 1
        if i >= len(s1):
            s2_count[ord(s2[i - len(s1)]) - ord('a')] -= 1
        if s1_count == s2_count:
            return True
    
    return False`,
    solutionCpp: `bool checkInclusion(string s1, string s2) {
    if (s1.size() > s2.size()) return false;
    
    vector<int> s1Count(26, 0), s2Count(26, 0);
    for (char c : s1) s1Count[c - 'a']++;
    
    for (int i = 0; i < s2.size(); i++) {
        s2Count[s2[i] - 'a']++;
        if (i >= (int)s1.size())
            s2Count[s2[i - s1.size()] - 'a']--;
        if (s1Count == s2Count)
            return true;
    }
    return false;
}`,
    timeComplexity: "O(n) where n = len(s2)",
    spaceComplexity: "O(1)",
    patternGuide: "Use **fixed-size sliding window** when:\n- Window size is predetermined\n- You need to check a property over all windows of that size\n- Can maintain state incrementally as window slides\n\nSimilar: Find All Anagrams, Maximum Average Subarray"
},
// ============================================================
// CATEGORY: BINARY SEARCH (Problems 11-15)
// ============================================================
{
    id: 11,
    lcNumber: 33,
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    category: "Binary Search",
    description: "There is an integer array `nums` sorted in ascending order (with distinct values). `nums` is possibly rotated at an unknown pivot. Given `target`, return its index or -1 if not found. You must write an algorithm with O(log n) runtime.",
    examples: [
        "Input: nums = [4,5,6,7,0,1,2], target = 0\nOutput: 4",
        "Input: nums = [4,5,6,7,0,1,2], target = 3\nOutput: -1"
    ],
    thinkingProcess: [
        { step: "Key observation", detail: "A rotated sorted array has TWO sorted halves. At any midpoint, one half is guaranteed to be perfectly sorted. We can determine which half is sorted and whether our target lies within it." },
        { step: "Determine the sorted half", detail: "If `nums[left] <= nums[mid]`, the left half [left..mid] is sorted. Otherwise the right half [mid..right] is sorted." },
        { step: "Decide which half to search", detail: "If left half is sorted AND `nums[left] <= target < nums[mid]`, search left. Otherwise search right. Mirror logic if right half is sorted." },
        { step: "Why this works", detail: "In a sorted half, we can definitively say whether target exists there using simple range comparison. If it doesn't, it must be in the other (unsorted) half. This eliminates half the array each step → O(log n)." },
        { step: "Handle edge cases", detail: "When mid equals target, return immediately. When left equals right, check that single element. The <= in `nums[left] <= nums[mid]` handles the case when left == mid." }
    ],
    keyInsight: "At every midpoint, one half is sorted. Check if target falls in the sorted half's range. If yes, search there. If no, search the other half. This preserves O(log n) binary search.",
    approach: "Binary search: find mid. Determine which half is sorted. Check if target is in that sorted range. Narrow search accordingly.",
    solutionPython: `def search(nums, target):
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        
        # Left half is sorted
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        # Right half is sorted
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    
    return -1`,
    solutionCpp: `int search(vector<int>& nums, int target) {
    int left = 0, right = nums.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        
        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid])
                right = mid - 1;
            else
                left = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[right])
                left = mid + 1;
            else
                right = mid - 1;
        }
    }
    return -1;
}`,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    patternGuide: "Use **modified binary search** when:\n- Array is sorted but rotated/modified\n- One half always maintains a useful property\n- You can determine which half to search using boundary comparisons\n\nSimilar: Find Minimum in Rotated Sorted Array, Search in Rotated Sorted Array II"
},
{
    id: 12,
    lcNumber: 153,
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "Medium",
    category: "Binary Search",
    description: "Given a sorted rotated array of unique elements, return the minimum element. You must write an algorithm that runs in O(log n) time.",
    examples: [
        "Input: nums = [3,4,5,1,2]\nOutput: 1\nExplanation: The original array was [1,2,3,4,5] rotated 3 times.",
        "Input: nums = [4,5,6,7,0,1,2]\nOutput: 0"
    ],
    thinkingProcess: [
        { step: "Visualize the rotation", detail: "A rotated sorted array looks like two ascending segments with a 'cliff'. The minimum is at the bottom of the cliff — the start of the second segment." },
        { step: "Binary search approach", detail: "Compare `nums[mid]` with `nums[right]`. If `nums[mid] > nums[right]`, the cliff is to the right of mid, so min is in [mid+1, right]. If `nums[mid] <= nums[right]`, mid could be the min or min is to the left." },
        { step: "Why compare with right, not left?", detail: "Comparing with `nums[left]` is ambiguous: `nums[mid] > nums[left]` could mean the array is simply sorted (no rotation) or the rotation point is to the right. Comparing with `nums[right]` always tells us which side the minimum is on." },
        { step: "Convergence", detail: "Use `left < right` (not <=). When `nums[mid] > nums[right]`: left = mid + 1. Else: right = mid. The loop converges to the single minimum element." },
        { step: "No rotation case", detail: "If the array isn't rotated, `nums[mid] <= nums[right]` always holds, and right keeps shrinking to left — correctly returning nums[0]." }
    ],
    keyInsight: "Compare mid with right boundary. If `nums[mid] > nums[right]`, the minimum is in the right half (there's a drop). Otherwise, minimum is in the left half including mid. Converge to the answer.",
    approach: "Binary search comparing mid with right. If mid > right, search right half. Else search left half including mid. Return nums[left] when converged.",
    solutionPython: `def findMin(nums):
    left, right = 0, len(nums) - 1
    
    while left < right:
        mid = (left + right) // 2
        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid
    
    return nums[left]`,
    solutionCpp: `int findMin(vector<int>& nums) {
    int left = 0, right = nums.size() - 1;
    
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] > nums[right])
            left = mid + 1;
        else
            right = mid;
    }
    return nums[left];
}`,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    patternGuide: "Use **binary search on rotated array** when:\n- Array is sorted but rotated\n- Finding a specific property (min, max, pivot)\n- Compare mid with boundary to determine which half\n\nSimilar: Search in Rotated Sorted Array, Find Minimum II (with duplicates)"
},
{
    id: 13,
    lcNumber: 4,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    category: "Binary Search",
    description: "Given two sorted arrays `nums1` and `nums2` of size `m` and `n`, return the median of the two sorted arrays. The overall run time complexity should be O(log(m+n)).",
    examples: [
        "Input: nums1 = [1,3], nums2 = [2]\nOutput: 2.0\nExplanation: Merged array = [1,2,3], median is 2.",
        "Input: nums1 = [1,2], nums2 = [3,4]\nOutput: 2.5\nExplanation: Merged array = [1,2,3,4], median is (2+3)/2 = 2.5."
    ],
    thinkingProcess: [
        { step: "Reframe as a partition problem", detail: "Instead of merging arrays, think: we need to split both arrays such that all elements on the left half ≤ all elements on the right half, and left half has exactly `(m+n+1)/2` elements." },
        { step: "Binary search on the smaller array", detail: "Binary search on `nums1` (ensure it's smaller). For a partition at position `i` in nums1, the partition in nums2 is `j = (m+n+1)/2 - i`. This ensures left half has the right size." },
        { step: "Check partition validity", detail: "Valid partition: `nums1[i-1] <= nums2[j]` AND `nums2[j-1] <= nums1[i]`. All left elements ≤ all right elements." },
        { step: "Adjust binary search", detail: "If `nums1[i-1] > nums2[j]`: partition in nums1 is too far right, move left. If `nums2[j-1] > nums1[i]`: partition is too far left, move right." },
        { step: "Handle edge cases", detail: "When `i=0` or `i=m`, use -∞ or +∞ for the missing boundary. Same for j. For odd total: median = max(left side). For even: average of max(left) and min(right)." },
        { step: "Why O(log(min(m,n)))", detail: "We binary search only on the smaller array, so at most O(log(min(m,n))) iterations. Each iteration is O(1)." }
    ],
    keyInsight: "Binary search for a partition point in the smaller array. The other array's partition is determined. A valid partition has all left elements ≤ all right elements. Median comes from the boundary elements.",
    approach: "Binary search on smaller array for partition i. Compute j = half - i. Check cross-boundary conditions. Adjust search. Extract median from boundary elements.",
    solutionPython: `def findMedianSortedArrays(nums1, nums2):
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    
    m, n = len(nums1), len(nums2)
    left, right = 0, m
    half = (m + n + 1) // 2
    
    while left <= right:
        i = (left + right) // 2
        j = half - i
        
        nums1_left = nums1[i - 1] if i > 0 else float('-inf')
        nums1_right = nums1[i] if i < m else float('inf')
        nums2_left = nums2[j - 1] if j > 0 else float('-inf')
        nums2_right = nums2[j] if j < n else float('inf')
        
        if nums1_left <= nums2_right and nums2_left <= nums1_right:
            if (m + n) % 2 == 1:
                return max(nums1_left, nums2_left)
            return (max(nums1_left, nums2_left) + 
                    min(nums1_right, nums2_right)) / 2
        elif nums1_left > nums2_right:
            right = i - 1
        else:
            left = i + 1`,
    solutionCpp: `double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
    if (nums1.size() > nums2.size())
        swap(nums1, nums2);
    
    int m = nums1.size(), n = nums2.size();
    int lo = 0, hi = m, half = (m + n + 1) / 2;
    
    while (lo <= hi) {
        int i = (lo + hi) / 2;
        int j = half - i;
        
        int left1  = (i > 0) ? nums1[i-1] : INT_MIN;
        int right1 = (i < m) ? nums1[i]   : INT_MAX;
        int left2  = (j > 0) ? nums2[j-1] : INT_MIN;
        int right2 = (j < n) ? nums2[j]   : INT_MAX;
        
        if (left1 <= right2 && left2 <= right1) {
            if ((m + n) % 2 == 1)
                return max(left1, left2);
            return (max(left1, left2) + min(right1, right2)) / 2.0;
        } else if (left1 > right2) {
            hi = i - 1;
        } else {
            lo = i + 1;
        }
    }
    return 0;
}`,
    timeComplexity: "O(log(min(m, n)))",
    spaceComplexity: "O(1)",
    patternGuide: "Use **binary search on partition** when:\n- Merging two sorted structures optimally\n- Finding kth element across sorted arrays\n- Problem reduces to finding a valid split point\n\nSimilar: Kth Smallest Element in Sorted Matrix"
},
{
    id: 14,
    lcNumber: 875,
    title: "Koko Eating Bananas",
    difficulty: "Medium",
    category: "Binary Search",
    description: "Koko loves bananas. There are `n` piles of bananas with `piles[i]` bananas. Guards return in `h` hours. Koko can eat `k` bananas/hour from one pile (if pile has fewer than k, she eats all and waits). Find the minimum integer `k` such that she can eat all bananas within `h` hours.",
    examples: [
        "Input: piles = [3,6,7,11], h = 8\nOutput: 4\nExplanation: At speed 4: ceil(3/4)+ceil(6/4)+ceil(7/4)+ceil(11/4) = 1+2+2+3 = 8 ≤ 8.",
        "Input: piles = [30,11,23,4,20], h = 5\nOutput: 30"
    ],
    thinkingProcess: [
        { step: "Identify the search space", detail: "We're searching for the minimum eating speed `k`. The range is [1, max(piles)]. At speed 1, she takes maximum time. At speed max(piles), she takes n hours (one pile per hour)." },
        { step: "Monotonic property", detail: "If speed `k` is sufficient (total hours ≤ h), then any speed > k is also sufficient. If k is insufficient, any speed < k is also insufficient. This is a classic binary search setup!" },
        { step: "Binary search on the answer", detail: "Binary search for the minimum `k` in [1, max(piles)] such that total_hours(k) ≤ h. This is called 'binary search on answer' — we're not searching an array but a value space." },
        { step: "Calculate hours for a given speed", detail: "For speed k: hours = sum(ceil(pile/k)) for each pile. Use `(pile + k - 1) // k` or `math.ceil(pile/k)` to compute ceiling division." },
        { step: "Trace through", detail: "piles=[3,6,7,11], h=8. Search [1,11]. mid=6: hours=1+1+2+2=6≤8 ✓, right=6. mid=3: 1+2+3+4=10>8 ✗, left=4. mid=5: 1+2+2+3=8≤8 ✓, right=5. mid=4: 1+2+2+3=8≤8 ✓, right=4. left==right==4. Answer: 4." }
    ],
    keyInsight: "Binary search on the answer (eating speed). The feasibility check is monotonic — if speed k works, all higher speeds work. Search for the minimum feasible speed.",
    approach: "Binary search in [1, max(piles)]. For each mid, compute total hours. If ≤ h, try smaller (right=mid). If > h, need faster (left=mid+1). Return left.",
    solutionPython: `import math

def minEatingSpeed(piles, h):
    left, right = 1, max(piles)
    
    while left < right:
        mid = (left + right) // 2
        hours = sum(math.ceil(p / mid) for p in piles)
        
        if hours <= h:
            right = mid
        else:
            left = mid + 1
    
    return left`,
    solutionCpp: `int minEatingSpeed(vector<int>& piles, int h) {
    int left = 1, right = *max_element(piles.begin(), piles.end());
    
    while (left < right) {
        int mid = left + (right - left) / 2;
        long hours = 0;
        for (int p : piles)
            hours += (p + mid - 1) / mid;
        
        if (hours <= h)
            right = mid;
        else
            left = mid + 1;
    }
    return left;
}`,
    timeComplexity: "O(n log(max(piles)))",
    spaceComplexity: "O(1)",
    patternGuide: "Use **binary search on answer** when:\n- You need to find min/max value satisfying a condition\n- The feasibility function is monotonic (if x works, x+1 works)\n- Direct computation is hard but checking a guess is easy\n\nSimilar: Capacity To Ship Packages, Split Array Largest Sum, Magnetic Force Between Two Balls"
},
{
    id: 15,
    lcNumber: 981,
    title: "Time Based Key-Value Store",
    difficulty: "Medium",
    category: "Binary Search",
    description: "Design a time-based key-value data structure that can store multiple values for the same key at different timestamps and retrieve the value at a certain timestamp. Implement `set(key, value, timestamp)` and `get(key, timestamp)` which returns the value with the largest timestamp ≤ given timestamp.",
    examples: [
        "Input: set(\"foo\",\"bar\",1), get(\"foo\",1) → \"bar\", get(\"foo\",3) → \"bar\", set(\"foo\",\"bar2\",4), get(\"foo\",4) → \"bar2\", get(\"foo\",5) → \"bar2\""
    ],
    thinkingProcess: [
        { step: "Understand the structure", detail: "Each key maps to multiple (timestamp, value) pairs. `set` always has increasing timestamps. `get` needs the most recent value at or before the queried timestamp." },
        { step: "Data structure choice", detail: "Use a hash map: key → list of (timestamp, value). Since timestamps are always increasing (per the problem), the list is automatically sorted." },
        { step: "Binary search for get", detail: "For `get(key, timestamp)`: binary search the list for the largest timestamp ≤ given timestamp. This is a classic 'upper bound - 1' or 'rightmost ≤ target' binary search." },
        { step: "Binary search variant", detail: "Use `bisect_right` to find the insertion point for `timestamp`. The answer is at index `pos - 1`. If pos == 0, no valid timestamp exists → return empty string." },
        { step: "Why not linear scan?", detail: "Linear scan is O(n) per get. With binary search, get is O(log n). Since there could be millions of set/get calls, this matters." }
    ],
    keyInsight: "Store values in a list per key (automatically sorted by timestamp). Use binary search to find the rightmost timestamp ≤ query time. This gives O(log n) lookups.",
    approach: "HashMap of key → sorted list of (timestamp, value). Set appends to list. Get uses binary search (bisect_right - 1) to find the latest valid entry.",
    solutionPython: `import bisect
from collections import defaultdict

class TimeMap:
    def __init__(self):
        self.store = defaultdict(list)
    
    def set(self, key, value, timestamp):
        self.store[key].append((timestamp, value))
    
    def get(self, key, timestamp):
        if key not in self.store:
            return ""
        
        entries = self.store[key]
        # Find rightmost entry with ts <= timestamp
        idx = bisect.bisect_right(entries, (timestamp, chr(127)))
        
        if idx == 0:
            return ""
        return entries[idx - 1][1]`,
    solutionCpp: `class TimeMap {
    unordered_map<string, vector<pair<int,string>>> store;
    
public:
    void set(string key, string value, int timestamp) {
        store[key].push_back({timestamp, value});
    }
    
    string get(string key, int timestamp) {
        if (!store.count(key)) return "";
        
        auto& entries = store[key];
        // Binary search for largest ts <= timestamp
        int lo = 0, hi = entries.size() - 1, ans = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (entries[mid].first <= timestamp) {
                ans = mid;
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return ans == -1 ? "" : entries[ans].second;
    }
};`,
    timeComplexity: "O(1) set, O(log n) get",
    spaceComplexity: "O(n) total entries",
    patternGuide: "Use **binary search on sorted list** when:\n- Data arrives in order and you need range/floor/ceiling queries\n- Lookups need to find closest match, not exact match\n- Design problems requiring efficient timestamp-based retrieval\n\nSimilar: Snapshot Array, Stock Price Fluctuation"
},
// ============================================================
// CATEGORY: STACK (Problems 16-20)
// ============================================================
{
    id: 16,
    lcNumber: 20,
    title: "Valid Parentheses",
    difficulty: "Medium",
    category: "Stack",
    description: "Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid. An input string is valid if: open brackets are closed by the same type, and in the correct order.",
    examples: [
        "Input: s = \"()[]{}\"\nOutput: true",
        "Input: s = \"(]\"\nOutput: false",
        "Input: s = \"([)]\"\nOutput: false"
    ],
    thinkingProcess: [
        { step: "Why a stack?", detail: "Parentheses follow LIFO order — the most recently opened bracket must be closed first. This is exactly what a stack does." },
        { step: "Algorithm", detail: "Push opening brackets onto the stack. When we see a closing bracket, check if the top of stack is its matching opener. If yes, pop. If no (or stack empty), invalid." },
        { step: "Final check", detail: "After processing all characters, the stack must be empty. If not, there are unclosed opening brackets → invalid." },
        { step: "Use a hash map for matching", detail: "Map closing → opening brackets: `)→(`, `]→[`, `}→{`. This avoids messy if-else chains." },
        { step: "Edge cases", detail: "Empty string → valid. Single character → invalid. Only opening or only closing → invalid." }
    ],
    keyInsight: "Stack naturally handles nested matching. Push openers, pop on closers. Each closer must match the most recent unclosed opener (stack top). Stack must be empty at the end.",
    approach: "Iterate through string. Push opening brackets. For closing brackets, check top of stack matches. Pop if match, return false if not. Return stack.empty() at end.",
    solutionPython: `def isValid(s):
    stack = []
    matching = {')': '(', ']': '[', '}': '{'}
    
    for char in s:
        if char in matching:
            if not stack or stack[-1] != matching[char]:
                return False
            stack.pop()
        else:
            stack.append(char)
    
    return len(stack) == 0`,
    solutionCpp: `bool isValid(string s) {
    stack<char> st;
    unordered_map<char,char> match = {
        {')', '('}, {']', '['}, {'}', '{'}
    };
    
    for (char c : s) {
        if (match.count(c)) {
            if (st.empty() || st.top() != match[c])
                return false;
            st.pop();
        } else {
            st.push(c);
        }
    }
    return st.empty();
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    patternGuide: "Use **stack for matching** when:\n- Nested structures need validation (parentheses, tags)\n- Most recent item must be processed first (LIFO)\n- Matching pairs in correct order\n\nSimilar: Decode String, Remove Invalid Parentheses, Score of Parentheses"
},
{
    id: 17,
    lcNumber: 84,
    title: "Largest Rectangle in Histogram",
    difficulty: "Hard",
    category: "Stack",
    description: "Given an array of integers `heights` representing the histogram's bar heights where width of each bar is 1, return the area of the largest rectangle in the histogram.",
    examples: [
        "Input: heights = [2,1,5,6,2,3]\nOutput: 10\nExplanation: The largest rectangle has area = 5 * 2 = 10 (bars at index 2 and 3).",
        "Input: heights = [2,4]\nOutput: 4"
    ],
    thinkingProcess: [
        { step: "Brute force thinking", detail: "For each bar, find how far left and right it can extend (while bars are ≥ its height). Area = height × width. This is O(n²). Can we precompute the left/right boundaries efficiently?" },
        { step: "Monotonic stack insight", detail: "We need, for each bar, the nearest shorter bar to its left and right. A monotonic increasing stack solves this: when we encounter a shorter bar, all taller bars on the stack have found their right boundary." },
        { step: "How the stack works", detail: "Maintain a stack of indices with increasing heights. When `heights[i] < heights[stack.top()]`, pop the top. The popped bar's rectangle extends from the new stack top (left boundary) to `i` (right boundary)." },
        { step: "Width calculation", detail: "For popped bar at index `top`: right boundary = i, left boundary = stack.top() (or -1 if empty). Width = i - left_boundary - 1. Area = heights[top] * width." },
        { step: "Process remaining bars", detail: "After scanning all bars, pop remaining stack elements. Their right boundary is `n` (they extend to the end). Same width formula applies." },
        { step: "Trace through", detail: "heights=[2,1,5,6,2,3]. Push 0(h=2). i=1(h=1<2): pop 0, area=2*1=2. Push 1. Push 2,3. i=4(h=2<6): pop 3, area=6*1=6. pop 2, area=5*2=10. Push 4. Push 5. Pop remaining. Max=10." }
    ],
    keyInsight: "Use a monotonic increasing stack. When a shorter bar is found, pop taller bars — each popped bar's rectangle extends from the new stack top to the current index. This finds each bar's maximum rectangle in O(n).",
    approach: "Maintain stack of indices (increasing heights). On shorter bar, pop and compute area. Popped bar's width = current_index - stack_top - 1. Process remaining at end.",
    solutionPython: `def largestRectangleArea(heights):
    stack = []  # indices
    max_area = 0
    
    for i in range(len(heights)):
        while stack and heights[stack[-1]] > heights[i]:
            h = heights[stack.pop()]
            w = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, h * w)
        stack.append(i)
    
    # Process remaining bars
    while stack:
        h = heights[stack.pop()]
        w = len(heights) if not stack else len(heights) - stack[-1] - 1
        max_area = max(max_area, h * w)
    
    return max_area`,
    solutionCpp: `int largestRectangleArea(vector<int>& heights) {
    stack<int> st;
    int maxArea = 0, n = heights.size();
    
    for (int i = 0; i < n; i++) {
        while (!st.empty() && heights[st.top()] > heights[i]) {
            int h = heights[st.top()]; st.pop();
            int w = st.empty() ? i : i - st.top() - 1;
            maxArea = max(maxArea, h * w);
        }
        st.push(i);
    }
    while (!st.empty()) {
        int h = heights[st.top()]; st.pop();
        int w = st.empty() ? n : n - st.top() - 1;
        maxArea = max(maxArea, h * w);
    }
    return maxArea;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    patternGuide: "Use **monotonic stack** when:\n- Finding next/previous smaller or larger element\n- Computing spans or areas bounded by smaller elements\n- Histogram, temperature, stock span problems\n\nSimilar: Trapping Rain Water, Daily Temperatures, Maximal Rectangle"
},
{
    id: 18,
    lcNumber: 394,
    title: "Decode String",
    difficulty: "Medium",
    category: "Stack",
    description: "Given an encoded string like `k[encoded_string]`, decode it by repeating `encoded_string` k times. The encoding may be nested. Input is always valid.",
    examples: [
        "Input: s = \"3[a]2[bc]\"\nOutput: \"aaabcbc\"",
        "Input: s = \"3[a2[c]]\"\nOutput: \"accaccacc\"",
        "Input: s = \"2[abc]3[cd]ef\"\nOutput: \"abcabccdcdcdef\""
    ],
    thinkingProcess: [
        { step: "Handle nesting", detail: "The encoding can be nested: `3[a2[c]]` → decode inner first. Nesting suggests a stack-based approach — when we encounter `[`, we push the current context and start fresh." },
        { step: "What to push on stack", detail: "When we see `[`, push the current string-so-far and the current multiplier onto the stack. Start building a new string for the content inside brackets." },
        { step: "What to do on `]`", detail: "When we see `]`, pop the previous string and multiplier. New current = previous_string + multiplier × current_string." },
        { step: "Building the multiplier", detail: "Numbers can be multi-digit (e.g., `12[a]`). Accumulate digits: `num = num * 10 + int(digit)`. Reset num when `[` is encountered." },
        { step: "Regular characters", detail: "Just append to the current string being built." },
        { step: "Trace through", detail: "\"3[a2[c]]\": Process '3', see '[': push (\"\",3), curr=\"\". 'a': curr=\"a\". '2', '[': push (\"a\",2), curr=\"\". 'c': curr=\"c\". ']': pop (\"a\",2), curr=\"a\"+2*\"c\"=\"acc\". ']': pop (\"\",3), curr=\"\"+3*\"acc\"=\"accaccacc\"." }
    ],
    keyInsight: "Stack stores context (previous string + multiplier) when entering brackets. On closing bracket, pop context and combine: previous + count × current. This naturally handles nesting.",
    approach: "Iterate chars. Digits: build number. `[`: push (currentStr, num) and reset. `]`: pop and combine. Letters: append to current string.",
    solutionPython: `def decodeString(s):
    stack = []
    current = ""
    num = 0
    
    for char in s:
        if char.isdigit():
            num = num * 10 + int(char)
        elif char == '[':
            stack.append((current, num))
            current = ""
            num = 0
        elif char == ']':
            prev_str, count = stack.pop()
            current = prev_str + count * current
        else:
            current += char
    
    return current`,
    solutionCpp: `string decodeString(string s) {
    stack<pair<string,int>> st;
    string current = "";
    int num = 0;
    
    for (char c : s) {
        if (isdigit(c)) {
            num = num * 10 + (c - '0');
        } else if (c == '[') {
            st.push({current, num});
            current = "";
            num = 0;
        } else if (c == ']') {
            auto [prev, count] = st.top(); st.pop();
            string repeated = "";
            for (int i = 0; i < count; i++)
                repeated += current;
            current = prev + repeated;
        } else {
            current += c;
        }
    }
    return current;
}`,
    timeComplexity: "O(n × maxK) where n is output length",
    spaceComplexity: "O(n) for stack depth",
    patternGuide: "Use **stack for nested context** when:\n- Nested structures with context that must be saved/restored\n- Bracket-based encodings or expressions\n- Each nesting level has its own state\n\nSimilar: Basic Calculator, Number of Atoms, Brace Expansion"
},
{
    id: 19,
    lcNumber: 227,
    title: "Basic Calculator II",
    difficulty: "Medium",
    category: "Stack",
    description: "Given a string `s` which represents a mathematical expression, evaluate it and return its value. The expression contains non-negative integers, `+`, `-`, `*`, `/` operators, and spaces. Integer division truncates toward zero.",
    examples: [
        "Input: s = \"3+2*2\"\nOutput: 7",
        "Input: s = \" 3/2 \"\nOutput: 1",
        "Input: s = \" 3+5 / 2 \"\nOutput: 5"
    ],
    thinkingProcess: [
        { step: "Operator precedence", detail: "* and / have higher precedence than + and -. We can't just evaluate left to right. Key idea: process * and / immediately, defer + and -." },
        { step: "Stack approach", detail: "Keep a stack of numbers. Track the previous operator. When we finish reading a number: if prev op is +, push +num; if -, push -num; if *, pop and push top*num; if /, pop and push top/num." },
        { step: "Why this handles precedence", detail: "By executing * and / immediately (modifying the top of stack), they're handled first. The + and - just push signed numbers. At the end, sum everything on the stack." },
        { step: "Parsing numbers", detail: "Multi-digit numbers: accumulate `num = num*10 + digit`. Process when we hit an operator or the end of string." },
        { step: "Handle spaces", detail: "Simply skip spaces. Process the number when we see a non-space, non-digit character, or reach the end." },
        { step: "Integer division toward zero", detail: "In Python, use `int(a/b)` instead of `a//b` because `//` floors toward negative infinity, but we need truncation toward zero. In C++, `/` already truncates." }
    ],
    keyInsight: "Stack defers addition/subtraction while immediately evaluating multiplication/division. Push signed values for +/-. Pop-compute-push for */. Final answer = sum of all stack values.",
    approach: "Iterate through string building numbers. On each operator (or end): apply previous operator. +/- push to stack. */ pop, compute, push. Sum stack at end.",
    solutionPython: `def calculate(s):
    stack = []
    num = 0
    prev_op = '+'
    
    for i, char in enumerate(s):
        if char.isdigit():
            num = num * 10 + int(char)
        
        if (char in '+-*/' or i == len(s) - 1):
            if prev_op == '+':
                stack.append(num)
            elif prev_op == '-':
                stack.append(-num)
            elif prev_op == '*':
                stack.append(stack.pop() * num)
            elif prev_op == '/':
                stack.append(int(stack.pop() / num))
            
            prev_op = char
            num = 0
    
    return sum(stack)`,
    solutionCpp: `int calculate(string s) {
    stack<long> st;
    long num = 0;
    char prevOp = '+';
    
    for (int i = 0; i < s.size(); i++) {
        if (isdigit(s[i]))
            num = num * 10 + (s[i] - '0');
        
        if ((!isdigit(s[i]) && s[i] != ' ') || i == s.size() - 1) {
            if (prevOp == '+') st.push(num);
            else if (prevOp == '-') st.push(-num);
            else if (prevOp == '*') { long t = st.top(); st.pop(); st.push(t * num); }
            else if (prevOp == '/') { long t = st.top(); st.pop(); st.push(t / num); }
            prevOp = s[i];
            num = 0;
        }
    }
    long result = 0;
    while (!st.empty()) { result += st.top(); st.pop(); }
    return result;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    patternGuide: "Use **stack for expression evaluation** when:\n- Evaluating math expressions with operator precedence\n- Deferring lower-precedence operations\n- Processing tokens left-to-right with look-back\n\nSimilar: Basic Calculator, Basic Calculator III, Evaluate Reverse Polish Notation"
},
{
    id: 20,
    lcNumber: 856,
    title: "Score of Parentheses",
    difficulty: "Medium",
    category: "Stack",
    description: "Given a balanced parentheses string `s`, return the score based on these rules: `()` has score 1. `AB` has score A+B. `(A)` has score 2*A.",
    examples: [
        "Input: s = \"()\"\nOutput: 1",
        "Input: s = \"(())\"\nOutput: 2",
        "Input: s = \"()()\"\nOutput: 2",
        "Input: s = \"(()(()))\"\nOutput: 6"
    ],
    thinkingProcess: [
        { step: "Understand the scoring", detail: "`()` = 1 point. Nesting `(A)` doubles A's score. Adjacent scores add up. Example: `(()(()))` = 2*(1 + 2*1) = 2*3 = 6." },
        { step: "Stack tracks depth", detail: "Use stack to track the running score at each depth level. When we see `(`, push current score and start fresh. When we see `)`, we've completed a group." },
        { step: "On `(`: save context", detail: "Push current score onto stack, reset current to 0. This saves the score accumulated at the outer level." },
        { step: "On `)`: combine", detail: "If current == 0, this is a `()` pair → score is 1. Otherwise, it's `(A)` → score is 2*current. Pop the outer score and add this to it: current = popped + max(2*current, 1)." },
        { step: "Trace through", detail: "`(()(()))`: '(' push 0, cur=0. '(' push 0, cur=0. ')' cur=0→1, pop 0, cur=0+1=1. '(' push 1, cur=0. '(' push 0, cur=0. ')' cur=0→1, pop 0, cur=1. ')' cur=2*1=2, pop 1, cur=1+2=3. ')' cur=2*3=6, pop 0, cur=6." }
    ],
    keyInsight: "Stack saves the outer score when entering a group. On closing: if inner is 0, score is 1 (base case); otherwise double it. Add to the popped outer score. Stack naturally handles nesting.",
    approach: "Stack of scores. On `(`: push current, reset to 0. On `)`: compute score = max(2*current, 1), add to popped value. Final current is the answer.",
    solutionPython: `def scoreOfParentheses(s):
    stack = []
    current = 0
    
    for char in s:
        if char == '(':
            stack.append(current)
            current = 0
        else:
            current = stack.pop() + max(2 * current, 1)
    
    return current`,
    solutionCpp: `int scoreOfParentheses(string s) {
    stack<int> st;
    int current = 0;
    
    for (char c : s) {
        if (c == '(') {
            st.push(current);
            current = 0;
        } else {
            current = st.top() + max(2 * current, 1);
            st.pop();
        }
    }
    return current;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    patternGuide: "Use **stack for nested scoring/computation** when:\n- Score/value depends on nesting depth\n- Each level has its own accumulated value\n- Opening bracket saves context, closing bracket combines\n\nSimilar: Decode String, Basic Calculator, Nested List Weight Sum"
},
// ============================================================
// CATEGORY: HEAP / PRIORITY QUEUE (Problems 21-25)
// ============================================================
{
    id: 21,
    lcNumber: 23,
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    category: "Heap / Priority Queue",
    description: "You are given an array of `k` linked lists, each sorted in ascending order. Merge all the linked lists into one sorted linked list and return it.",
    examples: [
        "Input: lists = [[1,4,5],[1,3,4],[2,6]]\nOutput: [1,1,2,3,4,4,5,6]",
        "Input: lists = []\nOutput: []"
    ],
    thinkingProcess: [
        { step: "Naive approach", detail: "Collect all values, sort, build list: O(N log N). Can we do better by exploiting that each list is already sorted?" },
        { step: "Use a min-heap", detail: "Key insight: the next smallest element must be the head of one of the k lists. Use a min-heap of size k to always pick the smallest current head. After picking, advance that list's pointer." },
        { step: "Heap operations", detail: "Initially push all k list heads. Pop min, add to result, push the next node from that list. Each push/pop is O(log k). Total N elements → O(N log k)." },
        { step: "Why this is optimal", detail: "We can't do better than O(N log k) for merging k sorted lists. Each element is involved in at most O(log k) comparisons." },
        { step: "Handle edge cases", detail: "Empty lists array, lists containing empty sublists. Filter out None/null heads before adding to heap." }
    ],
    keyInsight: "Min-heap of size k holds the current head of each list. Always extract the minimum, append to result, and push the next node from that list. This merges in O(N log k) time.",
    approach: "Push all list heads into a min-heap. Pop the smallest, add to result list. If that node has a next, push it. Repeat until heap is empty.",
    solutionPython: `import heapq

def mergeKLists(lists):
    heap = []
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))
    
    dummy = ListNode(0)
    current = dummy
    
    while heap:
        val, idx, node = heapq.heappop(heap)
        current.next = node
        current = current.next
        if node.next:
            heapq.heappush(heap, (node.next.val, idx, node.next))
    
    return dummy.next`,
    solutionCpp: `ListNode* mergeKLists(vector<ListNode*>& lists) {
    auto cmp = [](ListNode* a, ListNode* b) {
        return a->val > b->val; // min-heap
    };
    priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);
    
    for (auto* node : lists)
        if (node) pq.push(node);
    
    ListNode dummy(0);
    ListNode* curr = &dummy;
    
    while (!pq.empty()) {
        auto* node = pq.top(); pq.pop();
        curr->next = node;
        curr = curr->next;
        if (node->next) pq.push(node->next);
    }
    return dummy.next;
}`,
    timeComplexity: "O(N log k) where N = total elements",
    spaceComplexity: "O(k) for the heap",
    patternGuide: "Use **min-heap for k-way merge** when:\n- Merging k sorted sequences\n- Finding next smallest across multiple sources\n- Streaming data from k channels\n\nSimilar: Smallest Range Covering Elements from K Lists, Kth Smallest in Sorted Matrix"
},
{
    id: 22,
    lcNumber: 295,
    title: "Find Median from Data Stream",
    difficulty: "Hard",
    category: "Heap / Priority Queue",
    description: "Design a data structure that supports adding integers from a data stream and finding the median of all elements so far. Implement `addNum(int num)` and `findMedian()`.",
    examples: [
        "addNum(1), addNum(2), findMedian() → 1.5, addNum(3), findMedian() → 2.0"
    ],
    thinkingProcess: [
        { step: "What defines the median?", detail: "The median splits elements into two halves: lower half and upper half. For odd count, median is the middle. For even, it's the average of the two middle elements." },
        { step: "Two heaps insight", detail: "Use a max-heap for the lower half (gives us the largest of the small elements) and a min-heap for the upper half (gives us the smallest of the large elements). The median is at the tops of these heaps." },
        { step: "Balancing the heaps", detail: "We need to keep sizes balanced: max-heap can have at most 1 more element than min-heap. After each insertion, rebalance if needed." },
        { step: "Insertion strategy", detail: "Always add to max-heap first, then move its top to min-heap if needed. If min-heap gets too large, move its top back to max-heap. This ensures the invariant." },
        { step: "Finding median", detail: "If sizes equal: average of both tops. If max-heap is larger: its top is the median. O(1) operation." }
    ],
    keyInsight: "Two heaps: max-heap (lower half) and min-heap (upper half). Keep them balanced (size difference ≤ 1). Median is always at the tops. Insert is O(log n), findMedian is O(1).",
    approach: "Max-heap for smaller half, min-heap for larger half. Add to max-heap, rebalance tops to maintain order and size invariant. Median from tops.",
    solutionPython: `import heapq

class MedianFinder:
    def __init__(self):
        self.lo = []  # max-heap (negate values)
        self.hi = []  # min-heap
    
    def addNum(self, num):
        heapq.heappush(self.lo, -num)
        # Ensure max of lo <= min of hi
        heapq.heappush(self.hi, -heapq.heappop(self.lo))
        # Balance sizes: lo can be 1 larger
        if len(self.hi) > len(self.lo):
            heapq.heappush(self.lo, -heapq.heappop(self.hi))
    
    def findMedian(self):
        if len(self.lo) > len(self.hi):
            return -self.lo[0]
        return (-self.lo[0] + self.hi[0]) / 2`,
    solutionCpp: `class MedianFinder {
    priority_queue<int> lo;                          // max-heap
    priority_queue<int, vector<int>, greater<>> hi;  // min-heap
    
public:
    void addNum(int num) {
        lo.push(num);
        hi.push(lo.top()); lo.pop();
        if (hi.size() > lo.size()) {
            lo.push(hi.top()); hi.pop();
        }
    }
    
    double findMedian() {
        if (lo.size() > hi.size())
            return lo.top();
        return (lo.top() + hi.top()) / 2.0;
    }
};`,
    timeComplexity: "O(log n) add, O(1) median",
    spaceComplexity: "O(n)",
    patternGuide: "Use **two heaps (max + min)** when:\n- Maintaining a running median\n- Splitting data into two halves with access to boundary\n- Sliding window median problems\n\nSimilar: Sliding Window Median, IPO"
},
{
    id: 23,
    lcNumber: 347,
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    category: "Heap / Priority Queue",
    description: "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order. Your algorithm must be better than O(n log n).",
    examples: [
        "Input: nums = [1,1,1,2,2,3], k = 2\nOutput: [1,2]",
        "Input: nums = [1], k = 1\nOutput: [1]"
    ],
    thinkingProcess: [
        { step: "Count frequencies first", detail: "Use a hash map to count frequency of each element: O(n). Now we need the k elements with highest frequency." },
        { step: "Approach 1: Min-heap of size k", detail: "Iterate through frequency map. Maintain a min-heap of size k. If heap has <k elements, push. Otherwise, if current frequency > heap top, pop and push. Result: O(n log k)." },
        { step: "Approach 2: Bucket sort (optimal)", detail: "Frequencies range from 1 to n. Create buckets where bucket[i] = list of elements with frequency i. Scan buckets from high to low, collect k elements. O(n)!" },
        { step: "Why bucket sort works here", detail: "The frequency is bounded by n (array length). This lets us avoid comparison-based sorting entirely. We're doing a counting sort on frequencies." },
        { step: "Implementation detail", detail: "Create n+1 buckets. Fill them from the frequency map. Iterate from bucket n down to 1, adding elements to result until we have k." }
    ],
    keyInsight: "Count frequencies with a hash map, then use bucket sort on frequencies. Bucket index = frequency, bucket value = list of elements. Scan from highest frequency down. O(n) total.",
    approach: "1. Count frequencies. 2. Create frequency buckets (index = freq). 3. Scan from highest bucket down, collect k elements.",
    solutionPython: `def topKFrequent(nums, k):
    from collections import Counter
    count = Counter(nums)
    
    # Bucket sort: index = frequency
    buckets = [[] for _ in range(len(nums) + 1)]
    for num, freq in count.items():
        buckets[freq].append(num)
    
    result = []
    for freq in range(len(buckets) - 1, 0, -1):
        for num in buckets[freq]:
            result.append(num)
            if len(result) == k:
                return result
    
    return result`,
    solutionCpp: `vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int,int> count;
    for (int n : nums) count[n]++;
    
    // Bucket sort
    vector<vector<int>> buckets(nums.size() + 1);
    for (auto& [num, freq] : count)
        buckets[freq].push_back(num);
    
    vector<int> result;
    for (int f = buckets.size() - 1; f >= 1 && result.size() < k; f--)
        for (int num : buckets[f]) {
            result.push_back(num);
            if (result.size() == k) return result;
        }
    return result;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    patternGuide: "Use **bucket sort on frequency** when:\n- Finding top-k frequent elements\n- Frequency is bounded by array size\n- Need better than O(n log n)\n\nAlternatively, use **min-heap of size k** for O(n log k).\n\nSimilar: Sort Characters By Frequency, Top K Frequent Words"
},
{
    id: 24,
    lcNumber: 621,
    title: "Task Scheduler",
    difficulty: "Medium",
    category: "Heap / Priority Queue",
    description: "Given a char array `tasks` representing CPU tasks and a cooling interval `n`, find the minimum number of intervals the CPU needs to finish all tasks. There must be at least `n` intervals between two same tasks. The CPU can be idle.",
    examples: [
        "Input: tasks = [\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"], n = 2\nOutput: 8\nExplanation: A → B → idle → A → B → idle → A → B",
        "Input: tasks = [\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"], n = 0\nOutput: 6"
    ],
    thinkingProcess: [
        { step: "Think about the most frequent task", detail: "The task with highest frequency determines the schedule skeleton. If task A appears `maxFreq` times with cooldown `n`, it creates `(maxFreq-1)` gaps of size `n` between occurrences." },
        { step: "Visualize the frame", detail: "Think of `(maxFreq-1)` frames of size `(n+1)`, plus one final partial frame. Example: A appears 3 times, n=2: [A _ _] [A _ _] [A]. Frame size = n+1 = 3, gaps = 2." },
        { step: "Fill in other tasks", detail: "Other tasks fill the idle slots. If there are enough tasks, no idle time is needed. If not, idle slots remain." },
        { step: "Formula approach", detail: "`result = (maxFreq - 1) * (n + 1) + countOfMaxFreq`. Where `countOfMaxFreq` = number of tasks that have the maximum frequency. But if tasks overflow the frame, answer is just `len(tasks)` (no idle needed)." },
        { step: "Final answer", detail: "`max(len(tasks), (maxFreq - 1) * (n + 1) + countOfMaxFreq)`. The max handles the case where we have so many different tasks that no idle time is needed." }
    ],
    keyInsight: "The most frequent task creates a frame: `(maxFreq-1)` blocks of size `(n+1)` plus a tail. Other tasks fill gaps. Answer = `max(totalTasks, (maxFreq-1)*(n+1) + countOfMaxFreq)`.",
    approach: "Count frequencies. Find max frequency and how many tasks share it. Apply the formula. Take max with total task count.",
    solutionPython: `def leastInterval(tasks, n):
    from collections import Counter
    freq = Counter(tasks)
    max_freq = max(freq.values())
    max_count = sum(1 for v in freq.values() if v == max_freq)
    
    result = (max_freq - 1) * (n + 1) + max_count
    return max(result, len(tasks))`,
    solutionCpp: `int leastInterval(vector<char>& tasks, int n) {
    vector<int> freq(26, 0);
    for (char t : tasks) freq[t - 'A']++;
    
    int maxFreq = *max_element(freq.begin(), freq.end());
    int maxCount = count(freq.begin(), freq.end(), maxFreq);
    
    int result = (maxFreq - 1) * (n + 1) + maxCount;
    return max(result, (int)tasks.size());
}`,
    timeComplexity: "O(n) where n = number of tasks",
    spaceComplexity: "O(1) — fixed 26-letter count",
    patternGuide: "Use **greedy frequency analysis** when:\n- Scheduling with cooldown constraints\n- The most frequent item dominates the schedule\n- You need to minimize total time including idle slots\n\nSimilar: Reorganize String, Rearrange String k Distance Apart"
},
{
    id: 25,
    lcNumber: 767,
    title: "Reorganize String",
    difficulty: "Medium",
    category: "Heap / Priority Queue",
    description: "Given a string `s`, rearrange the characters so that no two adjacent characters are the same. If not possible, return an empty string.",
    examples: [
        "Input: s = \"aab\"\nOutput: \"aba\"",
        "Input: s = \"aaab\"\nOutput: \"\""
    ],
    thinkingProcess: [
        { step: "When is it impossible?", detail: "If any character appears more than `(n+1)/2` times (where n=len(s)), it's impossible — we can't avoid adjacency. E.g., 'aaab' (n=4, maxFreq=3 > 2)." },
        { step: "Greedy with max-heap", detail: "Always place the most frequent remaining character, but NOT the one we just placed. Use a max-heap to efficiently get the most frequent character." },
        { step: "Alternating placement", detail: "Pop the most frequent char, place it. Before pushing it back, place the second-most frequent. This ensures no two adjacent chars are the same." },
        { step: "Implementation trick", detail: "Pop top (most frequent), add to result. Save it. Pop next (second most), add to result. Push both back if count > 0. If heap is empty when we need a second char but only one type remains, check if it's valid." },
        { step: "Simpler approach: interleave", detail: "Alternatively: sort by frequency. Fill even indices first with the most frequent, then odd indices. This avoids adjacency naturally." }
    ],
    keyInsight: "Always pick the most frequent character that isn't the same as the last placed one. A max-heap lets us do this efficiently. Impossible if any char frequency > `(n+1)/2`.",
    approach: "Max-heap of (freq, char). Each step: pop most frequent, append to result. Keep the just-used char aside, push back after the next char is placed.",
    solutionPython: `import heapq
from collections import Counter

def reorganizeString(s):
    count = Counter(s)
    max_freq = max(count.values())
    if max_freq > (len(s) + 1) // 2:
        return ""
    
    # Max-heap (negate for max behavior)
    heap = [(-freq, char) for char, freq in count.items()]
    heapq.heapify(heap)
    
    result = []
    prev = (0, '')  # (neg_freq, char) of last used
    
    while heap:
        freq, char = heapq.heappop(heap)
        result.append(char)
        
        # Push back previous if it still has remaining count
        if prev[0] < 0:
            heapq.heappush(heap, prev)
        
        prev = (freq + 1, char)  # used one, so freq+1 (less negative)
    
    return ''.join(result)`,
    solutionCpp: `string reorganizeString(string s) {
    unordered_map<char,int> count;
    for (char c : s) count[c]++;
    
    priority_queue<pair<int,char>> pq;
    for (auto& [c, f] : count) {
        if (f > (s.size() + 1) / 2) return "";
        pq.push({f, c});
    }
    
    string result;
    pair<int,char> prev = {0, ' '};
    
    while (!pq.empty()) {
        auto [freq, ch] = pq.top(); pq.pop();
        result += ch;
        if (prev.first > 0) pq.push(prev);
        prev = {freq - 1, ch};
    }
    return result;
}`,
    timeComplexity: "O(n log k) where k = unique chars",
    spaceComplexity: "O(k)",
    patternGuide: "Use **max-heap with cooldown** when:\n- Rearranging elements to avoid adjacent duplicates\n- Scheduling with separation constraints\n- Greedily picking most frequent available option\n\nSimilar: Task Scheduler, Rearrange String k Distance Apart"
},
// ============================================================
// CATEGORY: LINKED LIST (Problems 26-30)
// ============================================================
{
    id: 26,
    lcNumber: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    category: "Linked List",
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order. Add the two numbers and return the sum as a linked list.",
    examples: [
        "Input: l1 = [2,4,3], l2 = [5,6,4]\nOutput: [7,0,8]\nExplanation: 342 + 465 = 807."
    ],
    thinkingProcess: [
        { step: "Digits are already reversed", detail: "This is a gift — we can add from the head (which is the least significant digit), just like grade-school addition. No need to reverse anything." },
        { step: "Elementary addition with carry", detail: "At each position: sum = l1.val + l2.val + carry. New digit = sum % 10. New carry = sum // 10. Create a node for the digit." },
        { step: "Handle different lengths", detail: "Lists may have different lengths. When one ends, treat missing digits as 0. Continue until both lists are exhausted AND carry is 0." },
        { step: "Use a dummy head", detail: "A dummy head node simplifies the code — we don't need special logic for creating the first node. Return dummy.next at the end." },
        { step: "Don't forget the final carry", detail: "If the last addition produces a carry (e.g., 99 + 1 = 100), we need an extra node. The while loop condition includes `carry > 0`." }
    ],
    keyInsight: "Simulate grade-school addition digit by digit. Reverse order means we start from heads (least significant). Track carry. Continue until both lists are done and carry is 0.",
    approach: "Iterate both lists simultaneously. Sum digits + carry. Create new node for sum % 10. Carry = sum / 10. Use dummy head. Handle unequal lengths and final carry.",
    solutionPython: `def addTwoNumbers(l1, l2):
    dummy = ListNode(0)
    current = dummy
    carry = 0
    
    while l1 or l2 or carry:
        val = carry
        if l1:
            val += l1.val
            l1 = l1.next
        if l2:
            val += l2.val
            l2 = l2.next
        
        carry = val // 10
        current.next = ListNode(val % 10)
        current = current.next
    
    return dummy.next`,
    solutionCpp: `ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
    ListNode dummy(0);
    ListNode* curr = &dummy;
    int carry = 0;
    
    while (l1 || l2 || carry) {
        int val = carry;
        if (l1) { val += l1->val; l1 = l1->next; }
        if (l2) { val += l2->val; l2 = l2->next; }
        carry = val / 10;
        curr->next = new ListNode(val % 10);
        curr = curr->next;
    }
    return dummy.next;
}`,
    timeComplexity: "O(max(m, n))",
    spaceComplexity: "O(max(m, n)) for result list",
    patternGuide: "Use **dummy head + simultaneous traversal** when:\n- Processing two linked lists in parallel\n- Building a new list node by node\n- Simulating arithmetic on linked list digits\n\nSimilar: Add Two Numbers II, Multiply Strings"
},
{
    id: 27,
    lcNumber: 25,
    title: "Reverse Nodes in k-Group",
    difficulty: "Hard",
    category: "Linked List",
    description: "Given the head of a linked list, reverse the nodes of the list `k` at a time, and return the modified list. If the number of remaining nodes is less than `k`, leave them as-is.",
    examples: [
        "Input: head = [1,2,3,4,5], k = 2\nOutput: [2,1,4,3,5]",
        "Input: head = [1,2,3,4,5], k = 3\nOutput: [3,2,1,4,5]"
    ],
    thinkingProcess: [
        { step: "Break into subproblems", detail: "We need to: (1) check if k nodes remain, (2) reverse those k nodes, (3) connect the reversed group to the previous and next groups, (4) repeat." },
        { step: "Counting k nodes", detail: "Before reversing, scan ahead k nodes. If fewer than k remain, don't reverse — just return." },
        { step: "Reverse a segment", detail: "Standard linked list reversal within a group: prev=null, iterate k times, each step: next_temp=curr.next, curr.next=prev, prev=curr, curr=next_temp." },
        { step: "Connecting groups", detail: "After reversing, the first node of the original group is now the last. It needs to connect to the result of reversing the remaining list. Recursion or iteration handles this." },
        { step: "Recursive approach", detail: "Recursively process: reverse first k nodes, then recursively process the rest. The original first node (now last of reversed group) connects to the recursive result. Clean and elegant." }
    ],
    keyInsight: "Check if k nodes exist, then reverse them. The original head of the group becomes the tail and links to the recursively processed remainder. Each reversal is standard linked list reversal.",
    approach: "Recursive: check k nodes ahead. Reverse k nodes. Original head links to recursive result of remaining list. Base case: fewer than k nodes, return head unchanged.",
    solutionPython: `def reverseKGroup(head, k):
    # Check if k nodes exist
    node = head
    for _ in range(k):
        if not node:
            return head
        node = node.next
    
    # Reverse k nodes
    prev, curr = None, head
    for _ in range(k):
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    
    # head is now the tail of reversed group
    # Connect to the result of reversing the rest
    head.next = reverseKGroup(curr, k)
    
    return prev  # new head of this group`,
    solutionCpp: `ListNode* reverseKGroup(ListNode* head, int k) {
    // Check if k nodes exist
    ListNode* node = head;
    for (int i = 0; i < k; i++) {
        if (!node) return head;
        node = node->next;
    }
    
    // Reverse k nodes
    ListNode* prev = nullptr;
    ListNode* curr = head;
    for (int i = 0; i < k; i++) {
        ListNode* nxt = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nxt;
    }
    
    // Connect tail to rest
    head->next = reverseKGroup(curr, k);
    return prev;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n/k) recursion stack",
    patternGuide: "Use **recursive group processing** when:\n- Processing linked list in fixed-size groups\n- Each group undergoes the same transformation\n- Groups connect sequentially\n\nSimilar: Reverse Linked List II, Swap Nodes in Pairs"
},
{
    id: 28,
    lcNumber: 138,
    title: "Copy List with Random Pointer",
    difficulty: "Medium",
    category: "Linked List",
    description: "A linked list has nodes with an additional `random` pointer that could point to any node in the list or null. Construct a deep copy of the list. Each node has `val`, `next`, and `random`.",
    examples: [
        "Input: head = [[7,null],[13,0],[11,4],[10,2],[1,0]]\nOutput: [[7,null],[13,0],[11,4],[10,2],[1,0]]"
    ],
    thinkingProcess: [
        { step: "Why is this tricky?", detail: "When copying, random pointers point to nodes in the ORIGINAL list, but we need them to point to the corresponding COPIED nodes. We need a mapping from original → copy." },
        { step: "Approach 1: Hash map", detail: "First pass: create all copied nodes, store mapping old→new in a hash map. Second pass: set next and random pointers using the map. Simple and O(n) space." },
        { step: "Approach 2: Interleaving (O(1) space)", detail: "Interleave copied nodes: A→A'→B→B'→C→C'. Now A'.random = A.random.next. Then separate the two lists. Clever but complex." },
        { step: "Hash map implementation", detail: "Pass 1: for each node, create copy, store in map. Pass 2: for each original node, set copy.next = map[original.next], copy.random = map[original.random]." },
        { step: "Handle null pointers", detail: "random can be null — check before looking up in map. Also handle empty list input." }
    ],
    keyInsight: "Use a hash map (original node → copied node) to maintain the correspondence. First pass creates all copies. Second pass wires up `next` and `random` using the map.",
    approach: "Two passes with hash map. Pass 1: create copy nodes. Pass 2: set next/random pointers via map lookup. O(n) time and space.",
    solutionPython: `def copyRandomList(head):
    if not head:
        return None
    
    old_to_new = {}
    
    # Pass 1: Create copy nodes
    node = head
    while node:
        old_to_new[node] = Node(node.val)
        node = node.next
    
    # Pass 2: Wire up pointers
    node = head
    while node:
        copy = old_to_new[node]
        copy.next = old_to_new.get(node.next)
        copy.random = old_to_new.get(node.random)
        node = node.next
    
    return old_to_new[head]`,
    solutionCpp: `Node* copyRandomList(Node* head) {
    if (!head) return nullptr;
    
    unordered_map<Node*, Node*> oldToNew;
    
    // Pass 1: Create copies
    Node* node = head;
    while (node) {
        oldToNew[node] = new Node(node->val);
        node = node->next;
    }
    
    // Pass 2: Wire pointers
    node = head;
    while (node) {
        oldToNew[node]->next = oldToNew[node->next];
        oldToNew[node]->random = oldToNew[node->random];
        node = node->next;
    }
    return oldToNew[head];
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n) for hash map",
    patternGuide: "Use **hash map for node mapping** when:\n- Deep copying a graph/list with arbitrary pointers\n- Need correspondence between original and copy\n- Two-pass: create nodes, then wire pointers\n\nSimilar: Clone Graph, Clone Binary Tree with Random Pointer"
},
{
    id: 29,
    lcNumber: 143,
    title: "Reorder List",
    difficulty: "Medium",
    category: "Linked List",
    description: "Given a singly linked list L0→L1→...→Ln, reorder it to: L0→Ln→L1→Ln-1→L2→Ln-2→... You may not modify values, only change node links.",
    examples: [
        "Input: head = [1,2,3,4]\nOutput: [1,4,2,3]",
        "Input: head = [1,2,3,4,5]\nOutput: [1,5,2,4,3]"
    ],
    thinkingProcess: [
        { step: "Observe the pattern", detail: "We interleave from the front and back. First node, last node, second node, second-to-last, etc. This requires efficient access to the back of the list." },
        { step: "Three-step approach", detail: "1. Find the middle of the list. 2. Reverse the second half. 3. Merge/interleave the two halves. Each step is a fundamental linked list operation." },
        { step: "Find middle: slow/fast pointers", detail: "Slow moves 1 step, fast moves 2. When fast reaches end, slow is at middle. Split the list into two halves at that point." },
        { step: "Reverse second half", detail: "Standard reversal. Now we have two lists: first half (original order) and second half (reversed)." },
        { step: "Merge alternately", detail: "Take one from first, one from second, alternate. This gives us L0→Ln→L1→Ln-1→... exactly." }
    ],
    keyInsight: "Decompose into three fundamental operations: (1) find middle with slow/fast, (2) reverse second half, (3) merge alternately. Each is a basic linked list pattern you should know by heart.",
    approach: "1. Slow/fast to find middle. 2. Reverse second half. 3. Interleave the two halves.",
    solutionPython: `def reorderList(head):
    if not head or not head.next:
        return
    
    # 1. Find middle
    slow, fast = head, head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    
    # 2. Reverse second half
    prev, curr = None, slow.next
    slow.next = None  # split the list
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    
    # 3. Merge alternately
    first, second = head, prev
    while second:
        tmp1, tmp2 = first.next, second.next
        first.next = second
        second.next = tmp1
        first = tmp1
        second = tmp2`,
    solutionCpp: `void reorderList(ListNode* head) {
    if (!head || !head->next) return;
    
    // 1. Find middle
    ListNode *slow = head, *fast = head;
    while (fast->next && fast->next->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    
    // 2. Reverse second half
    ListNode *prev = nullptr, *curr = slow->next;
    slow->next = nullptr;
    while (curr) {
        ListNode* nxt = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nxt;
    }
    
    // 3. Merge alternately
    ListNode *first = head, *second = prev;
    while (second) {
        ListNode *tmp1 = first->next, *tmp2 = second->next;
        first->next = second;
        second->next = tmp1;
        first = tmp1;
        second = tmp2;
    }
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    patternGuide: "Use **find middle + reverse + merge** when:\n- Reordering list based on front-back interleaving\n- Checking if list is a palindrome\n- Any problem needing access to the back half\n\nSimilar: Palindrome Linked List, Sort List"
},
{
    id: 30,
    lcNumber: 148,
    title: "Sort List",
    difficulty: "Medium",
    category: "Linked List",
    description: "Given the head of a linked list, return the list after sorting it in ascending order. Can you sort it in O(n log n) time and O(1) memory (i.e., constant space)?",
    examples: [
        "Input: head = [4,2,1,3]\nOutput: [1,2,3,4]",
        "Input: head = [-1,5,3,4,0]\nOutput: [-1,0,3,4,5]"
    ],
    thinkingProcess: [
        { step: "Which sort for linked lists?", detail: "Merge sort is ideal for linked lists: (1) no random access needed, (2) merging two sorted lists is natural for linked lists, (3) achieves O(n log n). Quicksort is bad due to no random access for pivot." },
        { step: "Divide", detail: "Split the list in half using slow/fast pointers. Recursively sort each half." },
        { step: "Conquer", detail: "Merge two sorted halves. This is the standard merge step — compare heads, pick smaller, advance that pointer." },
        { step: "Base case", detail: "A list with 0 or 1 nodes is already sorted. Return it." },
        { step: "Implementation detail", detail: "When splitting, break the link at the middle: `slow.next = null`. This gives us two independent lists. Each recursive call returns the head of the sorted sublist." }
    ],
    keyInsight: "Merge sort on linked list: find middle (slow/fast), split, recursively sort both halves, merge. Linked lists make merge sort natural because merging is O(n) without extra space.",
    approach: "Recursive merge sort: 1. Base case: 0 or 1 node. 2. Find middle with slow/fast. 3. Split. 4. Recursively sort halves. 5. Merge sorted halves.",
    solutionPython: `def sortList(head):
    if not head or not head.next:
        return head
    
    # Find middle and split
    slow, fast = head, head.next
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    mid = slow.next
    slow.next = None
    
    # Sort halves
    left = sortList(head)
    right = sortList(mid)
    
    # Merge
    dummy = ListNode(0)
    curr = dummy
    while left and right:
        if left.val <= right.val:
            curr.next = left
            left = left.next
        else:
            curr.next = right
            right = right.next
        curr = curr.next
    curr.next = left or right
    
    return dummy.next`,
    solutionCpp: `ListNode* sortList(ListNode* head) {
    if (!head || !head->next) return head;
    
    // Find middle
    ListNode *slow = head, *fast = head->next;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    ListNode* mid = slow->next;
    slow->next = nullptr;
    
    ListNode* left = sortList(head);
    ListNode* right = sortList(mid);
    
    // Merge
    ListNode dummy(0);
    ListNode* curr = &dummy;
    while (left && right) {
        if (left->val <= right->val) {
            curr->next = left; left = left->next;
        } else {
            curr->next = right; right = right->next;
        }
        curr = curr->next;
    }
    curr->next = left ? left : right;
    return dummy.next;
}`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(log n) recursion stack",
    patternGuide: "Use **merge sort on linked list** when:\n- Sorting a linked list in O(n log n)\n- Merging sorted lists (merge step)\n- Divide-and-conquer on linear structures\n\nSimilar: Merge Two Sorted Lists, Merge k Sorted Lists, Insertion Sort List"
},
// ============================================================
// CATEGORY: TREES (Problems 31-37)
// ============================================================
{
    id: 31,
    lcNumber: 236,
    title: "Lowest Common Ancestor of a Binary Tree",
    difficulty: "Medium",
    category: "Trees",
    description: "Given a binary tree, find the lowest common ancestor (LCA) of two given nodes `p` and `q`. The LCA is defined as the lowest node that has both `p` and `q` as descendants (a node can be a descendant of itself).",
    examples: [
        "Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1\nOutput: 3",
        "Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4\nOutput: 5"
    ],
    thinkingProcess: [
        { step: "Recursive thinking", detail: "At each node, ask: is p or q in my left subtree? Is p or q in my right subtree? If one is in left and one in right, I'm the LCA. If both are on one side, the LCA is in that subtree." },
        { step: "Base cases", detail: "If node is null, return null. If node IS p or q, return that node (it could be the LCA if the other is in its subtree)." },
        { step: "Recursive logic", detail: "Recurse left and right. If both return non-null, current node is LCA. If only one returns non-null, propagate that up (the LCA is in that subtree)." },
        { step: "Why returning the node works", detail: "When we find p, we return p. It propagates up. Similarly for q. The first node where both propagations meet is the LCA." },
        { step: "Trace through", detail: "Tree [3,5,1,...], p=5, q=4. At node 3: left=recurse(5), right=recurse(1). At node 5: it IS p, return 5. At node 1: neither p nor q found, returns null. At node 3: left=5 (non-null), right=null → return 5. But wait, q=4 is under 5... At node 5: returns 5 immediately (base case). So answer is 5. Correct!" }
    ],
    keyInsight: "Post-order traversal: check left and right subtrees. If both find a target, current node is LCA. If one finds a target, propagate it up. If node itself is a target, return it immediately.",
    approach: "Recursive DFS. Base: null→null, node==p or q→return node. Recurse both children. Both non-null→current is LCA. One non-null→propagate it.",
    solutionPython: `def lowestCommonAncestor(root, p, q):
    if not root or root == p or root == q:
        return root
    
    left = lowestCommonAncestor(root.left, p, q)
    right = lowestCommonAncestor(root.right, p, q)
    
    if left and right:
        return root  # LCA found
    return left or right  # propagate the non-null result`,
    solutionCpp: `TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root || root == p || root == q)
        return root;
    
    TreeNode* left = lowestCommonAncestor(root->left, p, q);
    TreeNode* right = lowestCommonAncestor(root->right, p, q);
    
    if (left && right) return root;
    return left ? left : right;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(h) recursion stack, h = height",
    patternGuide: "Use **post-order DFS with propagation** when:\n- Finding meeting point of two nodes\n- Answer depends on information from both subtrees\n- Need to propagate results upward\n\nSimilar: LCA of BST, LCA of Deepest Leaves, Distance Between Nodes"
},
{
    id: 32,
    lcNumber: 297,
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "Hard",
    category: "Trees",
    description: "Design an algorithm to serialize a binary tree to a string and deserialize it back. There is no restriction on how serialization/deserialization should work, as long as a binary tree can be serialized to a string and deserialized back to the original tree structure.",
    examples: [
        "Input: root = [1,2,3,null,null,4,5]\nOutput: [1,2,3,null,null,4,5]"
    ],
    thinkingProcess: [
        { step: "Why preorder?", detail: "Preorder traversal (root, left, right) naturally encodes the tree structure. We visit the root first, then recursively handle subtrees. Including null markers lets us reconstruct the exact tree." },
        { step: "Serialization", detail: "Preorder DFS: visit node → add value to string. For null nodes, add a marker (e.g., '#'). Separate values with commas." },
        { step: "Deserialization", detail: "Process the serialized string left to right. Each value creates a node. '#' returns null. Recursion automatically handles the tree structure." },
        { step: "Why null markers are essential", detail: "Without null markers, preorder alone isn't unique (need inorder too). With null markers, each node's left and right children are fully specified." },
        { step: "Use a queue/iterator for deserialization", detail: "Convert string to a list/queue of tokens. Pop from front: if '#', return null. Otherwise, create node, recursively build left then right subtrees." }
    ],
    keyInsight: "Preorder traversal with null markers uniquely defines a binary tree. Serialize: DFS recording values and '#' for nulls. Deserialize: consume tokens in the same preorder, '#' = null.",
    approach: "Serialize: preorder DFS, join values with delimiter, use '#' for null. Deserialize: split string, use iterator/queue, recursively build tree.",
    solutionPython: `class Codec:
    def serialize(self, root):
        result = []
        def dfs(node):
            if not node:
                result.append('#')
                return
            result.append(str(node.val))
            dfs(node.left)
            dfs(node.right)
        dfs(root)
        return ','.join(result)
    
    def deserialize(self, data):
        tokens = iter(data.split(','))
        def dfs():
            val = next(tokens)
            if val == '#':
                return None
            node = TreeNode(int(val))
            node.left = dfs()
            node.right = dfs()
            return node
        return dfs()`,
    solutionCpp: `class Codec {
public:
    string serialize(TreeNode* root) {
        if (!root) return "#";
        return to_string(root->val) + "," + 
               serialize(root->left) + "," + 
               serialize(root->right);
    }
    
    TreeNode* deserialize(string data) {
        queue<string> tokens;
        stringstream ss(data);
        string token;
        while (getline(ss, token, ','))
            tokens.push(token);
        return build(tokens);
    }
    
private:
    TreeNode* build(queue<string>& tokens) {
        string val = tokens.front(); tokens.pop();
        if (val == "#") return nullptr;
        TreeNode* node = new TreeNode(stoi(val));
        node->left = build(tokens);
        node->right = build(tokens);
        return node;
    }
};`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    patternGuide: "Use **preorder with null markers** when:\n- Serializing/deserializing trees\n- Need to uniquely encode tree structure\n- Converting tree to string and back\n\nSimilar: Verify Preorder Serialization, Construct Binary Tree from String"
},
{
    id: 33,
    lcNumber: 124,
    title: "Binary Tree Maximum Path Sum",
    difficulty: "Hard",
    category: "Trees",
    description: "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge. A path sum is the sum of node values in the path. Given a binary tree, return the maximum path sum. The path does not need to pass through the root.",
    examples: [
        "Input: root = [1,2,3]\nOutput: 6\nExplanation: Path 2 → 1 → 3 has sum 6.",
        "Input: root = [-10,9,20,null,null,15,7]\nOutput: 42\nExplanation: Path 15 → 20 → 7 has sum 42."
    ],
    thinkingProcess: [
        { step: "Two types of paths through a node", detail: "At each node, a path can either: (1) pass through the node connecting left and right subtrees (forming an arch), or (2) extend through the node into one subtree only (can be extended further up)." },
        { step: "What to return vs what to track", detail: "KEY: we track the global max (including arch paths), but RETURN the max single-branch path (usable by parent). These are different!" },
        { step: "Compute at each node", detail: "leftGain = max(0, dfs(left)). rightGain = max(0, dfs(right)). Max 0 because negative branches should be ignored. Arch through this node = node.val + leftGain + rightGain. Update global max." },
        { step: "What to return to parent", detail: "Parent can only use one branch from this node. Return node.val + max(leftGain, rightGain). This is the max path starting from this node going into one subtree." },
        { step: "Why max(0, ...)?", detail: "If a subtree contributes negative sum, don't include it. Taking nothing (0) is better than taking a negative path." }
    ],
    keyInsight: "At each node: compute the arch path (left + node + right) for global max, but return only the best single-branch path to parent. Use max(0, subtree) to ignore negative branches.",
    approach: "Post-order DFS. Each call returns max gain from one side. Global variable tracks the best arch path seen. Final answer is the global max.",
    solutionPython: `def maxPathSum(root):
    max_sum = float('-inf')
    
    def dfs(node):
        nonlocal max_sum
        if not node:
            return 0
        
        left_gain = max(0, dfs(node.left))
        right_gain = max(0, dfs(node.right))
        
        # Path through this node (arch)
        max_sum = max(max_sum, node.val + left_gain + right_gain)
        
        # Return max single-branch gain
        return node.val + max(left_gain, right_gain)
    
    dfs(root)
    return max_sum`,
    solutionCpp: `class Solution {
    int maxSum = INT_MIN;
    
    int dfs(TreeNode* node) {
        if (!node) return 0;
        int leftGain = max(0, dfs(node->left));
        int rightGain = max(0, dfs(node->right));
        
        maxSum = max(maxSum, node->val + leftGain + rightGain);
        return node->val + max(leftGain, rightGain);
    }
    
public:
    int maxPathSum(TreeNode* root) {
        dfs(root);
        return maxSum;
    }
};`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(h) recursion stack",
    patternGuide: "Use **return vs track pattern** when:\n- What you compute at a node differs from what you propagate up\n- Paths can branch (arch) at any node\n- Global optimum ≠ local return value\n\nSimilar: Diameter of Binary Tree, Longest Univalue Path"
},
{
    id: 34,
    lcNumber: 105,
    title: "Construct Binary Tree from Preorder and Inorder Traversal",
    difficulty: "Medium",
    category: "Trees",
    description: "Given two integer arrays `preorder` and `inorder` where `preorder` is the preorder traversal and `inorder` is the inorder traversal of the same tree, construct and return the binary tree.",
    examples: [
        "Input: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]\nOutput: [3,9,20,null,null,15,7]"
    ],
    thinkingProcess: [
        { step: "What preorder tells us", detail: "First element of preorder is always the root. Then comes the left subtree preorder, then right subtree preorder." },
        { step: "What inorder tells us", detail: "Root divides inorder into left subtree (everything left of root) and right subtree (everything right of root). This tells us the SIZE of each subtree." },
        { step: "Combine the two", detail: "Root = preorder[0]. Find root in inorder (say at index k). Left subtree has k elements. So left subtree preorder = preorder[1:k+1], left inorder = inorder[:k]. Recurse." },
        { step: "Optimize root lookup", detail: "Building a hash map of value → index in inorder gives O(1) lookup instead of O(n) linear search. Total time becomes O(n)." },
        { step: "Recursive construction", detail: "buildTree(preStart, inStart, inEnd). Root = preorder[preStart]. Split inorder. Recurse for left and right with adjusted indices." }
    ],
    keyInsight: "Preorder's first element is the root. Find it in inorder to determine left/right subtree sizes. Recursively build subtrees using these boundaries. Hash map for O(1) inorder lookups.",
    approach: "Hash map for inorder indices. Recursive build: root from preorder, split inorder at root position, recurse with adjusted ranges.",
    solutionPython: `def buildTree(preorder, inorder):
    inorder_map = {val: idx for idx, val in enumerate(inorder)}
    
    def build(pre_start, in_start, in_end):
        if in_start > in_end:
            return None
        
        root_val = preorder[pre_start]
        root = TreeNode(root_val)
        mid = inorder_map[root_val]
        left_size = mid - in_start
        
        root.left = build(pre_start + 1, in_start, mid - 1)
        root.right = build(pre_start + left_size + 1, mid + 1, in_end)
        return root
    
    return build(0, 0, len(inorder) - 1)`,
    solutionCpp: `class Solution {
    unordered_map<int,int> inMap;
    
    TreeNode* build(vector<int>& preorder, int preStart,
                    int inStart, int inEnd) {
        if (inStart > inEnd) return nullptr;
        
        int rootVal = preorder[preStart];
        TreeNode* root = new TreeNode(rootVal);
        int mid = inMap[rootVal];
        int leftSize = mid - inStart;
        
        root->left = build(preorder, preStart + 1, inStart, mid - 1);
        root->right = build(preorder, preStart + leftSize + 1, mid + 1, inEnd);
        return root;
    }
    
public:
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        for (int i = 0; i < inorder.size(); i++)
            inMap[inorder[i]] = i;
        return build(preorder, 0, 0, inorder.size() - 1);
    }
};`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n) for hash map + recursion",
    patternGuide: "Use **traversal reconstruction** when:\n- Building tree from two traversal orders\n- Root identification + subtree splitting\n- Combining preorder (root) + inorder (structure)\n\nSimilar: Construct from Inorder and Postorder, Construct BST from Preorder"
},
{
    id: 35,
    lcNumber: 98,
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    category: "Trees",
    description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST: left subtree values < node, right subtree values > node, and both subtrees are also valid BSTs.",
    examples: [
        "Input: root = [2,1,3]\nOutput: true",
        "Input: root = [5,1,4,null,null,3,6]\nOutput: false\nExplanation: Node 4 is in right subtree of 5 but 4 < 5."
    ],
    thinkingProcess: [
        { step: "Common mistake", detail: "Just checking node.left.val < node.val < node.right.val is NOT enough. Every node in the left subtree must be less than the root, not just the direct child." },
        { step: "Range-based validation", detail: "Each node has a valid range: (min, max). Root: (-∞, +∞). Left child: (min, parent.val). Right child: (parent.val, max). If any node violates its range, not a BST." },
        { step: "Recursive approach", detail: "Pass the allowed range down. At each node, check if value is within (low, high). Recurse: left child inherits (low, node.val), right child inherits (node.val, high)." },
        { step: "Alternative: inorder traversal", detail: "Inorder traversal of a valid BST produces a strictly increasing sequence. Track previous value; if current ≤ previous, invalid." },
        { step: "Handle edge cases", detail: "Empty tree is valid. Single node is valid. Equal values: strictly less/greater (no duplicates in standard BST)." }
    ],
    keyInsight: "Pass valid range (low, high) to each node. Left children narrow the upper bound, right children narrow the lower bound. Any violation means invalid BST.",
    approach: "Recursive DFS with range [low, high]. Check node.val is in range. Left: upper bound = node.val. Right: lower bound = node.val.",
    solutionPython: `def isValidBST(root):
    def validate(node, low, high):
        if not node:
            return True
        if node.val <= low or node.val >= high:
            return False
        return (validate(node.left, low, node.val) and
                validate(node.right, node.val, high))
    
    return validate(root, float('-inf'), float('inf'))`,
    solutionCpp: `bool isValidBST(TreeNode* root) {
    return validate(root, LONG_MIN, LONG_MAX);
}

bool validate(TreeNode* node, long low, long high) {
    if (!node) return true;
    if (node->val <= low || node->val >= high)
        return false;
    return validate(node->left, low, node->val) &&
           validate(node->right, node->val, high);
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(h) recursion stack",
    patternGuide: "Use **range propagation** when:\n- Validating BST properties\n- Each node's validity depends on ancestors\n- Constraints narrow as you go deeper\n\nSimilar: Kth Smallest in BST, Recover BST, Inorder Successor"
},
{
    id: 36,
    lcNumber: 230,
    title: "Kth Smallest Element in a BST",
    difficulty: "Medium",
    category: "Trees",
    description: "Given the root of a BST and an integer `k`, return the `k`th smallest value (1-indexed) of all the values of the nodes in the tree.",
    examples: [
        "Input: root = [3,1,4,null,2], k = 1\nOutput: 1",
        "Input: root = [5,3,6,2,4,null,null,1], k = 3\nOutput: 3"
    ],
    thinkingProcess: [
        { step: "BST property + inorder", detail: "Inorder traversal of a BST visits nodes in ascending order. So the kth node visited in an inorder traversal is the kth smallest element." },
        { step: "Don't traverse everything", detail: "We don't need the full inorder traversal. Stop as soon as we've visited k nodes. This makes it efficient for small k." },
        { step: "Iterative inorder", detail: "Use a stack-based iterative inorder traversal. Go left as far as possible (push all). Pop = visit. Then go right. Count visits until we reach k." },
        { step: "Why iterative?", detail: "Iterative lets us stop early cleanly. With recursion, we'd need a counter + early termination which is messier." },
        { step: "Follow-up: frequent queries", detail: "If the tree is modified often and we query often, augment each node with a `leftCount` field (number of nodes in left subtree). Then kth smallest is O(h)." }
    ],
    keyInsight: "Inorder traversal of BST = sorted order. Use iterative inorder (stack-based) and return the kth element popped. Early termination when count reaches k.",
    approach: "Iterative inorder: push all left children. Pop (visit), decrement k. If k=0, return value. Go right. Repeat.",
    solutionPython: `def kthSmallest(root, k):
    stack = []
    current = root
    
    while stack or current:
        # Go left as far as possible
        while current:
            stack.append(current)
            current = current.left
        
        current = stack.pop()
        k -= 1
        if k == 0:
            return current.val
        
        current = current.right`,
    solutionCpp: `int kthSmallest(TreeNode* root, int k) {
    stack<TreeNode*> st;
    TreeNode* curr = root;
    
    while (!st.empty() || curr) {
        while (curr) {
            st.push(curr);
            curr = curr->left;
        }
        curr = st.top(); st.pop();
        if (--k == 0) return curr->val;
        curr = curr->right;
    }
    return -1; // unreachable if k is valid
}`,
    timeComplexity: "O(h + k) where h = height",
    spaceComplexity: "O(h)",
    patternGuide: "Use **iterative inorder traversal** when:\n- Finding kth element in a BST\n- Need sorted access to BST elements\n- Early termination is beneficial\n\nSimilar: Validate BST, BST Iterator, Inorder Successor"
},
{
    id: 37,
    lcNumber: 543,
    title: "Diameter of Binary Tree",
    difficulty: "Medium",
    category: "Trees",
    description: "Given the root of a binary tree, return the length of the diameter. The diameter is the length of the longest path between any two nodes (measured in number of edges). This path may or may not pass through the root.",
    examples: [
        "Input: root = [1,2,3,4,5]\nOutput: 3\nExplanation: Path 4→2→1→3 or 5→2→1→3, length = 3 edges.",
        "Input: root = [1,2]\nOutput: 1"
    ],
    thinkingProcess: [
        { step: "Diameter at a node", detail: "The longest path through a node = left height + right height (in edges). The diameter is the maximum of this across all nodes." },
        { step: "Same pattern as Max Path Sum", detail: "Track a global maximum (diameter) while returning height to parent. At each node: diameter candidate = leftHeight + rightHeight. Return value = 1 + max(leftHeight, rightHeight)." },
        { step: "Height definition", detail: "Height of a null node = 0. Height of a leaf = 0 (in edges). Wait — actually, let's return the number of edges to the deepest leaf. Null → -1 or 0 depending on convention. Use 0 for null, then depth = 1 + max(left, right) for nodes." },
        { step: "Simple recursive DFS", detail: "DFS returns height (depth from this node down). At each node, update global max with leftHeight + rightHeight. Return max(left, right) + 1." },
        { step: "Don't forget: diameter ≠ height", detail: "The diameter is the longest path between two LEAVES, not the height of the tree. It may not pass through the root. That's why we check every node." }
    ],
    keyInsight: "Same pattern as Binary Tree Maximum Path Sum but simpler. At each node: diameter = leftHeight + rightHeight. Return height to parent. Track global max diameter.",
    approach: "Post-order DFS returning height. At each node, update global max with sum of left and right heights. Return max height + 1.",
    solutionPython: `def diameterOfBinaryTree(root):
    diameter = 0
    
    def height(node):
        nonlocal diameter
        if not node:
            return 0
        
        left_h = height(node.left)
        right_h = height(node.right)
        
        diameter = max(diameter, left_h + right_h)
        return 1 + max(left_h, right_h)
    
    height(root)
    return diameter`,
    solutionCpp: `class Solution {
    int diameter = 0;
    
    int height(TreeNode* node) {
        if (!node) return 0;
        int leftH = height(node->left);
        int rightH = height(node->right);
        diameter = max(diameter, leftH + rightH);
        return 1 + max(leftH, rightH);
    }
    
public:
    int diameterOfBinaryTree(TreeNode* root) {
        height(root);
        return diameter;
    }
};`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(h) recursion stack",
    patternGuide: "Use **return height, track global** when:\n- Finding longest path in a tree\n- Diameter, longest univalue path, etc.\n- What you optimize globally ≠ what you return to parent\n\nSimilar: Binary Tree Maximum Path Sum, Longest Univalue Path"
},
// ============================================================
// CATEGORY: GRAPH BFS/DFS (Problems 38-45)
// ============================================================
{
    id: 38,
    lcNumber: 200,
    title: "Number of Islands",
    difficulty: "Medium",
    category: "Graph BFS/DFS",
    description: "Given an `m x n` 2D grid of `'1'`s (land) and `'0'`s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
    examples: [
        "Input: grid = [\n  [\"1\",\"1\",\"0\",\"0\",\"0\"],\n  [\"1\",\"1\",\"0\",\"0\",\"0\"],\n  [\"0\",\"0\",\"1\",\"0\",\"0\"],\n  [\"0\",\"0\",\"0\",\"1\",\"1\"]\n]\nOutput: 3"
    ],
    thinkingProcess: [
        { step: "Connected components", detail: "This is counting connected components of '1's. Each island is a connected component where connectivity is 4-directional (up, down, left, right)." },
        { step: "DFS flood fill", detail: "Scan grid. When we find a '1', that's a new island. DFS/BFS to mark all connected '1's as visited (sink them to '0'). Increment count." },
        { step: "Why modify the grid?", detail: "Instead of using a separate visited array, we can set grid[i][j] = '0' after visiting. This is O(1) space but modifies input. Alternatively, use a visited set." },
        { step: "DFS implementation", detail: "For each unvisited '1': increment count, DFS to mark all reachable '1's. DFS explores 4 directions, checks bounds and value, recurses." },
        { step: "Complexity", detail: "Each cell is visited at most once. Total: O(m×n). Space: O(m×n) worst case for DFS recursion (long snake-like island)." }
    ],
    keyInsight: "Count connected components by scanning for unvisited '1's. Each time, run DFS/BFS to mark the entire island as visited. Number of DFS calls = number of islands.",
    approach: "Iterate grid. On finding '1': increment count, DFS to sink all connected '1's to '0'. Return count.",
    solutionPython: `def numIslands(grid):
    if not grid:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    count = 0
    
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == '0':
            return
        grid[r][c] = '0'  # mark visited
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    
    return count`,
    solutionCpp: `int numIslands(vector<vector<char>>& grid) {
    int rows = grid.size(), cols = grid[0].size();
    int count = 0;
    
    function<void(int,int)> dfs = [&](int r, int c) {
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] == '0')
            return;
        grid[r][c] = '0';
        dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);
    };
    
    for (int r = 0; r < rows; r++)
        for (int c = 0; c < cols; c++)
            if (grid[r][c] == '1') {
                count++;
                dfs(r, c);
            }
    return count;
}`,
    timeComplexity: "O(m × n)",
    spaceComplexity: "O(m × n) worst case recursion",
    patternGuide: "Use **DFS/BFS flood fill** when:\n- Counting connected components in a grid\n- Marking regions, filling areas\n- Any grid traversal with connectivity\n\nSimilar: Max Area of Island, Surrounded Regions, Rotting Oranges"
},
{
    id: 39,
    lcNumber: 417,
    title: "Pacific Atlantic Water Flow",
    difficulty: "Medium",
    category: "Graph BFS/DFS",
    description: "Given an `m x n` matrix of heights, water can flow from a cell to adjacent cells with height ≤ current. The Pacific ocean touches the left and top edges. The Atlantic ocean touches the right and bottom edges. Return all cells from which water can reach BOTH oceans.",
    examples: [
        "Input: heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]\nOutput: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]"
    ],
    thinkingProcess: [
        { step: "Reverse the flow", detail: "Instead of checking if each cell can reach both oceans (expensive), reverse: start from the oceans and find which cells can be reached. A cell reachable from both oceans is in the answer." },
        { step: "DFS from ocean borders", detail: "DFS from all Pacific border cells (top row + left column): mark all cells reachable by flowing UPHILL (reverse of water flowing down). Do the same from Atlantic border cells." },
        { step: "Why uphill?", detail: "Water flows from high to low. In reverse, we go from ocean (low) to source (high). So from a cell, we can move to a neighbor only if neighbor's height ≥ current height." },
        { step: "Intersection", detail: "A cell in BOTH the Pacific-reachable set AND the Atlantic-reachable set can reach both oceans. Return the intersection." },
        { step: "Implementation", detail: "Two boolean matrices: pacific[r][c] and atlantic[r][c]. DFS from borders, marking reachable cells. Collect cells where both are true." }
    ],
    keyInsight: "Reverse the problem: DFS uphill from ocean borders. Pacific: start from top/left edges. Atlantic: start from bottom/right edges. Answer = intersection of both reachable sets.",
    approach: "Two DFS passes: one from Pacific borders, one from Atlantic. Each marks reachable cells (going uphill). Intersection gives the answer.",
    solutionPython: `def pacificAtlantic(heights):
    if not heights:
        return []
    
    rows, cols = len(heights), len(heights[0])
    pacific = set()
    atlantic = set()
    
    def dfs(r, c, visited):
        visited.add((r, c))
        for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
            nr, nc = r + dr, c + dc
            if (0 <= nr < rows and 0 <= nc < cols and 
                (nr, nc) not in visited and 
                heights[nr][nc] >= heights[r][c]):
                dfs(nr, nc, visited)
    
    for c in range(cols):
        dfs(0, c, pacific)
        dfs(rows - 1, c, atlantic)
    for r in range(rows):
        dfs(r, 0, pacific)
        dfs(r, cols - 1, atlantic)
    
    return list(pacific & atlantic)`,
    solutionCpp: `vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {
    int R = heights.size(), C = heights[0].size();
    vector<vector<bool>> pac(R, vector<bool>(C)), atl(R, vector<bool>(C));
    int dirs[] = {0,1,0,-1,0};
    
    function<void(int,int,vector<vector<bool>>&)> dfs = 
        [&](int r, int c, vector<vector<bool>>& vis) {
        vis[r][c] = true;
        for (int d = 0; d < 4; d++) {
            int nr = r+dirs[d], nc = c+dirs[d+1];
            if (nr>=0 && nr<R && nc>=0 && nc<C && 
                !vis[nr][nc] && heights[nr][nc] >= heights[r][c])
                dfs(nr, nc, vis);
        }
    };
    
    for (int c = 0; c < C; c++) { dfs(0,c,pac); dfs(R-1,c,atl); }
    for (int r = 0; r < R; r++) { dfs(r,0,pac); dfs(r,C-1,atl); }
    
    vector<vector<int>> result;
    for (int r = 0; r < R; r++)
        for (int c = 0; c < C; c++)
            if (pac[r][c] && atl[r][c])
                result.push_back({r, c});
    return result;
}`,
    timeComplexity: "O(m × n)",
    spaceComplexity: "O(m × n)",
    patternGuide: "Use **reverse DFS from boundary** when:\n- Checking reachability to edges/boundaries\n- Starting from target and working backwards\n- Finding intersection of two reachability sets\n\nSimilar: Surrounded Regions, Longest Increasing Path in Matrix"
},
{
    id: 40,
    lcNumber: 133,
    title: "Clone Graph",
    difficulty: "Medium",
    category: "Graph BFS/DFS",
    description: "Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node contains a value and a list of its neighbors.",
    examples: [
        "Input: adjList = [[2,4],[1,3],[2,4],[1,3]]\nOutput: [[2,4],[1,3],[2,4],[1,3]]"
    ],
    thinkingProcess: [
        { step: "Same pattern as Copy List with Random Pointer", detail: "We need a mapping from original node → cloned node. Then wire up the neighbors using this mapping." },
        { step: "DFS approach", detail: "Visit a node: if already cloned (in map), return its clone. Otherwise, create clone, add to map, then recursively clone all neighbors." },
        { step: "Why we need the map", detail: "Graph has cycles. Without tracking cloned nodes, we'd clone forever. The map serves as both a visited set and an old→new mapping." },
        { step: "BFS alternative", detail: "BFS: queue starts with the given node. For each dequeued node, clone it (if not yet), then for each neighbor, clone the neighbor and add the edge. Same complexity, different order." },
        { step: "Edge cases", detail: "Null input → null. Single node with no neighbors. Self-loop (node is its own neighbor)." }
    ],
    keyInsight: "Hash map from original → clone node. DFS/BFS: if node already cloned, return existing clone. Otherwise create clone, recursively/iteratively clone neighbors. Map prevents infinite loops in cycles.",
    approach: "DFS with hash map. On first visit: create clone, map it, recurse on neighbors. On revisit: return existing clone from map.",
    solutionPython: `def cloneGraph(node):
    if not node:
        return None
    
    cloned = {}
    
    def dfs(n):
        if n in cloned:
            return cloned[n]
        
        copy = Node(n.val)
        cloned[n] = copy
        
        for neighbor in n.neighbors:
            copy.neighbors.append(dfs(neighbor))
        
        return copy
    
    return dfs(node)`,
    solutionCpp: `Node* cloneGraph(Node* node) {
    if (!node) return nullptr;
    unordered_map<Node*, Node*> cloned;
    
    function<Node*(Node*)> dfs = [&](Node* n) -> Node* {
        if (cloned.count(n)) return cloned[n];
        Node* copy = new Node(n->val);
        cloned[n] = copy;
        for (Node* neighbor : n->neighbors)
            copy->neighbors.push_back(dfs(neighbor));
        return copy;
    };
    
    return dfs(node);
}`,
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V) for map + recursion",
    patternGuide: "Use **DFS + hash map clone** when:\n- Deep copying a graph structure\n- Need old→new node mapping\n- Handling cycles with visited tracking\n\nSimilar: Copy List with Random Pointer, Clone N-ary Tree"
},
{
    id: 41,
    lcNumber: 332,
    title: "Reconstruct Itinerary",
    difficulty: "Hard",
    category: "Graph BFS/DFS",
    description: "You are given a list of airline `tickets` where `tickets[i] = [from, to]`. Reconstruct the itinerary starting from `\"JFK\"`. If multiple valid itineraries, return the one with the smallest lexical order. You must use all tickets exactly once.",
    examples: [
        "Input: tickets = [[\"MUC\",\"LHR\"],[\"JFK\",\"MUC\"],[\"SFO\",\"SJC\"],[\"LHR\",\"SFO\"]]\nOutput: [\"JFK\",\"MUC\",\"LHR\",\"SFO\",\"SJC\"]",
        "Input: tickets = [[\"JFK\",\"SFO\"],[\"JFK\",\"ATL\"],[\"SFO\",\"ATL\"],[\"ATL\",\"JFK\"],[\"ATL\",\"SFO\"]]\nOutput: [\"JFK\",\"ATL\",\"JFK\",\"SFO\",\"ATL\",\"SFO\"]"
    ],
    thinkingProcess: [
        { step: "This is an Eulerian path problem", detail: "We need to use every edge (ticket) exactly once. This is finding an Eulerian path in a directed graph, starting from JFK." },
        { step: "Hierholzer's algorithm", detail: "Start at JFK. Greedily follow edges (in lexical order). When stuck (no outgoing edges), backtrack and add the current node to the front of the result." },
        { step: "Why post-order?", detail: "We add nodes to the result in reverse order (post-visit). This ensures dead-end paths are added first, and the main path wraps around them correctly." },
        { step: "Sorted adjacency list", detail: "For lexical ordering, sort destinations for each airport. Use a min-heap or sorted list, pop from the front when visiting." },
        { step: "Implementation", detail: "Build adjacency list (sorted). DFS from JFK: while neighbors exist, pop the smallest and DFS. After all neighbors processed, append current to result. Reverse at end." }
    ],
    keyInsight: "Eulerian path via Hierholzer's algorithm. DFS with post-order insertion: when stuck, add current node to front of result. Sort adjacency lists for lexical order. Reverse result at end.",
    approach: "Build sorted adjacency list. DFS from JFK: pop smallest neighbor, recurse. After all neighbors done, append to result. Reverse result.",
    solutionPython: `from collections import defaultdict

def findItinerary(tickets):
    graph = defaultdict(list)
    for src, dst in sorted(tickets, reverse=True):
        graph[src].append(dst)
    
    route = []
    def dfs(airport):
        while graph[airport]:
            dfs(graph[airport].pop())
        route.append(airport)
    
    dfs("JFK")
    return route[::-1]`,
    solutionCpp: `vector<string> findItinerary(vector<vector<string>>& tickets) {
    unordered_map<string, priority_queue<string, vector<string>, greater<>>> graph;
    for (auto& t : tickets)
        graph[t[0]].push(t[1]);
    
    vector<string> route;
    function<void(string)> dfs = [&](string airport) {
        while (!graph[airport].empty()) {
            string next = graph[airport].top();
            graph[airport].pop();
            dfs(next);
        }
        route.push_back(airport);
    };
    
    dfs("JFK");
    reverse(route.begin(), route.end());
    return route;
}`,
    timeComplexity: "O(E log E) for sorting",
    spaceComplexity: "O(E) for graph + recursion",
    patternGuide: "Use **Hierholzer's algorithm** when:\n- Finding Eulerian path/circuit (use every edge once)\n- Post-order DFS with backtracking\n- Itinerary reconstruction\n\nSimilar: Cracking the Safe, Valid Arrangement of Pairs"
},
{
    id: 42,
    lcNumber: 207,
    title: "Course Schedule",
    difficulty: "Medium",
    category: "Graph BFS/DFS",
    description: "There are `numCourses` courses labeled `0` to `numCourses-1`. You are given `prerequisites` where `prerequisites[i] = [a, b]` means you must take course `b` before course `a`. Return `true` if you can finish all courses (no cycles).",
    examples: [
        "Input: numCourses = 2, prerequisites = [[1,0]]\nOutput: true\nExplanation: Take course 0 then 1.",
        "Input: numCourses = 2, prerequisites = [[1,0],[0,1]]\nOutput: false\nExplanation: Circular dependency."
    ],
    thinkingProcess: [
        { step: "Model as a directed graph", detail: "Each course is a node. prerequisite [a,b] = edge b→a (must take b before a). The question: does this graph have a cycle?" },
        { step: "Cycle detection approaches", detail: "Two main approaches: (1) DFS with 3-state coloring (white/gray/black), (2) BFS topological sort (Kahn's algorithm). Both detect cycles." },
        { step: "DFS approach", detail: "Color each node: unvisited (0), in-progress (1), completed (2). During DFS, if we visit an in-progress node, we found a cycle." },
        { step: "Kahn's BFS approach", detail: "Compute in-degrees. Start with all zero-in-degree nodes. Process: decrement neighbors' in-degrees. If neighbor reaches 0, add to queue. If we process all nodes, no cycle." },
        { step: "Why Kahn's works for cycle detection", detail: "If there's a cycle, nodes in the cycle never reach in-degree 0, so they're never processed. If processed count < numCourses, there's a cycle." }
    ],
    keyInsight: "This is cycle detection in a directed graph. BFS topological sort (Kahn's): start with 0-indegree nodes, process neighbors. If all nodes processed, no cycle. Otherwise, cycle exists.",
    approach: "Build graph + in-degree array. Queue all 0-indegree nodes. BFS: process node, decrement neighbors' in-degrees, enqueue new 0-indegree nodes. Check if all processed.",
    solutionPython: `from collections import deque, defaultdict

def canFinish(numCourses, prerequisites):
    graph = defaultdict(list)
    in_degree = [0] * numCourses
    
    for a, b in prerequisites:
        graph[b].append(a)
        in_degree[a] += 1
    
    queue = deque([i for i in range(numCourses) if in_degree[i] == 0])
    count = 0
    
    while queue:
        node = queue.popleft()
        count += 1
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    return count == numCourses`,
    solutionCpp: `bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> graph(numCourses);
    vector<int> inDegree(numCourses, 0);
    
    for (auto& p : prerequisites) {
        graph[p[1]].push_back(p[0]);
        inDegree[p[0]]++;
    }
    
    queue<int> q;
    for (int i = 0; i < numCourses; i++)
        if (inDegree[i] == 0) q.push(i);
    
    int count = 0;
    while (!q.empty()) {
        int node = q.front(); q.pop();
        count++;
        for (int next : graph[node])
            if (--inDegree[next] == 0) q.push(next);
    }
    return count == numCourses;
}`,
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V + E)",
    patternGuide: "Use **Kahn's BFS topological sort** when:\n- Detecting cycles in directed graphs\n- Ordering tasks with dependencies\n- Processing nodes in dependency order\n\nSimilar: Course Schedule II, Alien Dictionary, Parallel Courses"
},
{
    id: 43,
    lcNumber: 547,
    title: "Number of Provinces",
    difficulty: "Medium",
    category: "Graph BFS/DFS",
    description: "There are `n` cities. `isConnected[i][j] = 1` if city `i` and city `j` are directly connected. A province is a group of connected cities. Return the total number of provinces.",
    examples: [
        "Input: isConnected = [[1,1,0],[1,1,0],[0,0,1]]\nOutput: 2\nExplanation: Cities 0,1 form one province. City 2 is another.",
        "Input: isConnected = [[1,0,0],[0,1,0],[0,0,1]]\nOutput: 3"
    ],
    thinkingProcess: [
        { step: "Connected components in a graph", detail: "This is the classic connected components problem, but on an adjacency matrix instead of a grid. Each province is a connected component." },
        { step: "DFS/BFS approach", detail: "For each unvisited city, start a DFS/BFS to visit all cities in its province. Count the number of DFS/BFS calls." },
        { step: "Union-Find approach", detail: "Alternatively, use Union-Find. Initially each city is its own province. For each connection, union the two cities. Count distinct roots at the end." },
        { step: "Adjacency matrix traversal", detail: "For city i, check row i to find all directly connected cities. DFS to all unvisited connected cities." },
        { step: "Difference from Number of Islands", detail: "Islands: grid cells connected by adjacency. Provinces: cities connected by an adjacency matrix. Same concept, different input format." }
    ],
    keyInsight: "Count connected components in an adjacency matrix graph. DFS from each unvisited node marks its entire component. Number of DFS calls = number of provinces.",
    approach: "DFS with visited array. For each unvisited city, DFS to visit all reachable cities. Count components.",
    solutionPython: `def findCircleNum(isConnected):
    n = len(isConnected)
    visited = set()
    provinces = 0
    
    def dfs(city):
        visited.add(city)
        for neighbor in range(n):
            if neighbor not in visited and isConnected[city][neighbor] == 1:
                dfs(neighbor)
    
    for city in range(n):
        if city not in visited:
            dfs(city)
            provinces += 1
    
    return provinces`,
    solutionCpp: `int findCircleNum(vector<vector<int>>& isConnected) {
    int n = isConnected.size(), provinces = 0;
    vector<bool> visited(n, false);
    
    function<void(int)> dfs = [&](int city) {
        visited[city] = true;
        for (int j = 0; j < n; j++)
            if (!visited[j] && isConnected[city][j])
                dfs(j);
    };
    
    for (int i = 0; i < n; i++)
        if (!visited[i]) { dfs(i); provinces++; }
    return provinces;
}`,
    timeComplexity: "O(n²)",
    spaceComplexity: "O(n)",
    patternGuide: "Use **DFS connected components** when:\n- Counting groups in a graph\n- Adjacency matrix or list input\n- Union-Find is an alternative\n\nSimilar: Number of Islands, Accounts Merge, Connected Components"
},
{
    id: 44,
    lcNumber: 994,
    title: "Rotting Oranges",
    difficulty: "Medium",
    category: "Graph BFS/DFS",
    description: "In a grid, `0` = empty, `1` = fresh orange, `2` = rotten orange. Every minute, fresh oranges adjacent (4-directional) to a rotten orange become rotten. Return the minimum minutes until no fresh orange remains, or -1 if impossible.",
    examples: [
        "Input: grid = [[2,1,1],[1,1,0],[0,1,1]]\nOutput: 4",
        "Input: grid = [[2,1,1],[0,1,1],[1,0,1]]\nOutput: -1"
    ],
    thinkingProcess: [
        { step: "Multi-source BFS", detail: "All rotten oranges spread simultaneously — this is multi-source BFS. Start with ALL rotten oranges in the queue at time 0, then BFS layer by layer." },
        { step: "Why BFS, not DFS?", detail: "BFS explores level by level (minute by minute). Each level = one minute of spreading. DFS would not give us the correct timing." },
        { step: "Track time", detail: "Each BFS level = one minute. After BFS completes, the number of levels processed = minutes elapsed. Or track by storing (row, col, time) in queue." },
        { step: "Check if all oranges are rotten", detail: "After BFS, scan grid for any remaining fresh oranges (1s). If found, return -1. Otherwise return the time." },
        { step: "Count fresh oranges upfront", detail: "Count fresh oranges at the start. Each time one rots, decrement count. If count > 0 after BFS, return -1." }
    ],
    keyInsight: "Multi-source BFS: enqueue ALL rotten oranges initially. BFS level by level — each level is one minute. Track remaining fresh count. If fresh remains after BFS, return -1.",
    approach: "Find all rotten oranges and count fresh. BFS from all rotten simultaneously. Each level = 1 minute. Decrement fresh count. Return minutes or -1.",
    solutionPython: `from collections import deque

def orangesRotting(grid):
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh = 0
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c))
            elif grid[r][c] == 1:
                fresh += 1
    
    minutes = 0
    while queue and fresh > 0:
        minutes += 1
        for _ in range(len(queue)):
            r, c = queue.popleft()
            for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2
                    fresh -= 1
                    queue.append((nr, nc))
    
    return minutes if fresh == 0 else -1`,
    solutionCpp: `int orangesRotting(vector<vector<int>>& grid) {
    int R = grid.size(), C = grid[0].size();
    queue<pair<int,int>> q;
    int fresh = 0;
    
    for (int r = 0; r < R; r++)
        for (int c = 0; c < C; c++) {
            if (grid[r][c] == 2) q.push({r, c});
            else if (grid[r][c] == 1) fresh++;
        }
    
    int minutes = 0;
    int dirs[] = {0,1,0,-1,0};
    while (!q.empty() && fresh > 0) {
        minutes++;
        int sz = q.size();
        while (sz--) {
            auto [r, c] = q.front(); q.pop();
            for (int d = 0; d < 4; d++) {
                int nr = r+dirs[d], nc = c+dirs[d+1];
                if (nr>=0 && nr<R && nc>=0 && nc<C && grid[nr][nc]==1) {
                    grid[nr][nc] = 2;
                    fresh--;
                    q.push({nr, nc});
                }
            }
        }
    }
    return fresh == 0 ? minutes : -1;
}`,
    timeComplexity: "O(m × n)",
    spaceComplexity: "O(m × n)",
    patternGuide: "Use **multi-source BFS** when:\n- Multiple starting points spread simultaneously\n- Need minimum time for something to reach everywhere\n- Level-by-level processing = time steps\n\nSimilar: Walls and Gates, Shortest Bridge, 01 Matrix"
},
{
    id: 45,
    lcNumber: 827,
    title: "Making A Large Island",
    difficulty: "Hard",
    category: "Graph BFS/DFS",
    description: "You are given an `n x n` binary grid. You may change at most one `0` to `1`. Return the size of the largest island after this change. An island is a 4-directionally connected group of `1`s.",
    examples: [
        "Input: grid = [[1,0],[0,1]]\nOutput: 3\nExplanation: Change one 0 to 1, connecting the two islands.",
        "Input: grid = [[1,1],[1,0]]\nOutput: 4",
        "Input: grid = [[1,1],[1,1]]\nOutput: 4"
    ],
    thinkingProcess: [
        { step: "Brute force", detail: "Try flipping each 0 to 1, then count the island size with BFS/DFS. This is O(n⁴) — way too slow." },
        { step: "Precompute island sizes", detail: "First pass: label each island with a unique ID and compute its size. Store sizes in a map: islandId → size." },
        { step: "Try each 0 cell", detail: "For each 0 cell, check its 4 neighbors. Sum up the sizes of distinct neighboring islands (using IDs to avoid double counting) + 1 (for the flipped cell itself). Track the maximum." },
        { step: "Label islands with DFS", detail: "Use DFS to assign each cell an island ID (starting from 2 to avoid confusion with 0 and 1). Store grid[r][c] = islandId. Count sizes during DFS." },
        { step: "Use a set for distinct neighbors", detail: "When checking a 0 cell's neighbors, use a set of island IDs to avoid counting the same island twice (e.g., if two neighbors belong to the same island)." },
        { step: "Edge case: all 1s", detail: "If no 0 exists, the answer is the entire grid. Handle by starting with the max existing island size." }
    ],
    keyInsight: "Two passes: (1) DFS to label islands with unique IDs and compute sizes. (2) For each 0, sum sizes of distinct neighboring islands + 1. The set prevents double counting.",
    approach: "1. DFS to label islands (ID + size). 2. For each 0 cell, collect unique neighbor island IDs, sum their sizes + 1. 3. Return max.",
    solutionPython: `def largestIsland(grid):
    n = len(grid)
    island_size = {}
    island_id = 2  # start from 2
    
    def dfs(r, c, id):
        if r < 0 or r >= n or c < 0 or c >= n or grid[r][c] != 1:
            return 0
        grid[r][c] = id
        return 1 + dfs(r+1,c,id) + dfs(r-1,c,id) + dfs(r,c+1,id) + dfs(r,c-1,id)
    
    # Label islands
    for r in range(n):
        for c in range(n):
            if grid[r][c] == 1:
                size = dfs(r, c, island_id)
                island_size[island_id] = size
                island_id += 1
    
    if not island_size:
        return 1  # all 0s
    
    result = max(island_size.values())  # no flip needed case
    
    # Try flipping each 0
    for r in range(n):
        for c in range(n):
            if grid[r][c] == 0:
                neighbors = set()
                for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] > 1:
                        neighbors.add(grid[nr][nc])
                total = 1 + sum(island_size[id] for id in neighbors)
                result = max(result, total)
    
    return result`,
    solutionCpp: `int largestIsland(vector<vector<int>>& grid) {
    int n = grid.size(), id = 2;
    unordered_map<int,int> sizes;
    int dirs[] = {0,1,0,-1,0};
    
    function<int(int,int,int)> dfs = [&](int r, int c, int id) -> int {
        if (r<0||r>=n||c<0||c>=n||grid[r][c]!=1) return 0;
        grid[r][c] = id;
        return 1 + dfs(r+1,c,id)+dfs(r-1,c,id)+dfs(r,c+1,id)+dfs(r,c-1,id);
    };
    
    for (int r = 0; r < n; r++)
        for (int c = 0; c < n; c++)
            if (grid[r][c] == 1) {
                sizes[id] = dfs(r, c, id);
                id++;
            }
    
    int result = sizes.empty() ? 1 : 0;
    for (auto& [k,v] : sizes) result = max(result, v);
    
    for (int r = 0; r < n; r++)
        for (int c = 0; c < n; c++)
            if (grid[r][c] == 0) {
                unordered_set<int> nbrs;
                for (int d = 0; d < 4; d++) {
                    int nr=r+dirs[d], nc=c+dirs[d+1];
                    if (nr>=0&&nr<n&&nc>=0&&nc<n&&grid[nr][nc]>1)
                        nbrs.insert(grid[nr][nc]);
                }
                int total = 1;
                for (int id : nbrs) total += sizes[id];
                result = max(result, total);
            }
    return result;
}`,
    timeComplexity: "O(n²)",
    spaceComplexity: "O(n²)",
    patternGuide: "Use **island labeling + neighbor aggregation** when:\n- Combining/connecting components optimally\n- Need to query component sizes efficiently\n- Modifying one cell affects multiple components\n\nSimilar: Number of Islands, Max Area of Island"
},
// ============================================================
// CATEGORY: TOPOLOGICAL SORT (Problems 46-48)
// ============================================================
{
    id: 46,
    lcNumber: 210,
    title: "Course Schedule II",
    difficulty: "Medium",
    category: "Topological Sort",
    description: "There are `numCourses` courses with prerequisites. Return the ordering of courses you should take to finish all courses. If impossible, return an empty array. If multiple valid orderings exist, return any.",
    examples: [
        "Input: numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]\nOutput: [0,2,1,3] or [0,1,2,3]",
        "Input: numCourses = 2, prerequisites = [[1,0],[0,1]]\nOutput: [] (impossible, cycle exists)"
    ],
    thinkingProcess: [
        { step: "Topological sort", detail: "This is textbook topological ordering. We need a linear ordering where for every edge u→v, u comes before v. This only exists if the graph is a DAG (no cycles)." },
        { step: "Kahn's algorithm (BFS)", detail: "Same as Course Schedule I, but record the order. Start with 0-indegree nodes, process them, add to result. When neighbor reaches 0 indegree, enqueue it." },
        { step: "DFS approach", detail: "DFS with post-order: after processing all descendants, add node to result. Reverse at end. Detect cycles with 3-state coloring." },
        { step: "Cycle = impossible", detail: "If we can't process all nodes (BFS: count < numCourses, DFS: cycle found), return empty array." },
        { step: "Multiple valid orderings", detail: "The problem says any valid ordering is fine. Different implementations may produce different valid orderings." }
    ],
    keyInsight: "Topological sort via Kahn's BFS: process 0-indegree nodes first, recording the order. If all nodes are processed, return the order. Otherwise, return empty (cycle exists).",
    approach: "Build graph + indegree. Enqueue 0-indegree nodes. BFS: dequeue → add to result → decrement neighbor indegrees → enqueue new 0-indegree. Check count.",
    solutionPython: `from collections import deque, defaultdict

def findOrder(numCourses, prerequisites):
    graph = defaultdict(list)
    in_degree = [0] * numCourses
    
    for a, b in prerequisites:
        graph[b].append(a)
        in_degree[a] += 1
    
    queue = deque(i for i in range(numCourses) if in_degree[i] == 0)
    order = []
    
    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    return order if len(order) == numCourses else []`,
    solutionCpp: `vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> graph(numCourses);
    vector<int> inDeg(numCourses, 0);
    
    for (auto& p : prerequisites) {
        graph[p[1]].push_back(p[0]);
        inDeg[p[0]]++;
    }
    
    queue<int> q;
    for (int i = 0; i < numCourses; i++)
        if (inDeg[i] == 0) q.push(i);
    
    vector<int> order;
    while (!q.empty()) {
        int node = q.front(); q.pop();
        order.push_back(node);
        for (int next : graph[node])
            if (--inDeg[next] == 0) q.push(next);
    }
    return order.size() == numCourses ? order : vector<int>();
}`,
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V + E)",
    patternGuide: "Use **topological sort (Kahn's BFS)** when:\n- Ordering tasks with dependencies\n- Detecting cycles + producing valid order\n- Build systems, course scheduling\n\nSimilar: Course Schedule, Alien Dictionary, Parallel Courses"
},
{
    id: 47,
    lcNumber: 269,
    title: "Alien Dictionary",
    difficulty: "Hard",
    category: "Topological Sort",
    description: "There is a new alien language that uses the English alphabet but with a different order. Given a list of `words` sorted lexicographically by the alien language's rules, derive the order of letters. If no valid ordering exists, return empty string.",
    examples: [
        "Input: words = [\"wrt\",\"wrf\",\"er\",\"ett\",\"rftt\"]\nOutput: \"wertf\"",
        "Input: words = [\"z\",\"x\"]\nOutput: \"zx\""
    ],
    thinkingProcess: [
        { step: "Extract ordering constraints", detail: "Compare adjacent words character by character. The first difference tells us an ordering: `word1[i] < word2[i]` in alien order. This gives us a directed edge." },
        { step: "Build a graph", detail: "Each letter is a node. Each constraint (a comes before b) is an edge a→b. Then find a topological ordering of this graph." },
        { step: "Edge case: prefix", detail: "If word1 is a prefix of word2 (e.g., \"abc\" before \"ab\"), the ordering is INVALID — a longer word can't come before its prefix. Check this!" },
        { step: "Topological sort", detail: "Use Kahn's BFS. Start with all 0-indegree letters. Process in BFS order. If we can't process all letters, there's a contradiction → return \"\"." },
        { step: "Include all letters", detail: "Some letters may not appear in any constraint but exist in the words. Make sure to include all unique letters in the graph." }
    ],
    keyInsight: "Compare adjacent words to extract character ordering (edges). Build a directed graph. Topological sort gives the alien alphabet order. Invalid if cycle or prefix violation.",
    approach: "1. Compare adjacent words for first difference → edges. 2. Build graph with all unique letters. 3. Topological sort (Kahn's). 4. Check validity.",
    solutionPython: `from collections import defaultdict, deque

def alienOrder(words):
    # Build graph with all unique letters
    graph = defaultdict(set)
    in_degree = {c: 0 for word in words for c in word}
    
    # Extract edges from adjacent words
    for i in range(len(words) - 1):
        w1, w2 = words[i], words[i + 1]
        min_len = min(len(w1), len(w2))
        
        # Check invalid prefix case
        if len(w1) > len(w2) and w1[:min_len] == w2[:min_len]:
            return ""
        
        for j in range(min_len):
            if w1[j] != w2[j]:
                if w2[j] not in graph[w1[j]]:
                    graph[w1[j]].add(w2[j])
                    in_degree[w2[j]] += 1
                break
    
    # Topological sort
    queue = deque(c for c in in_degree if in_degree[c] == 0)
    result = []
    
    while queue:
        c = queue.popleft()
        result.append(c)
        for neighbor in graph[c]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    return ''.join(result) if len(result) == len(in_degree) else ""`,
    solutionCpp: `string alienOrder(vector<string>& words) {
    unordered_map<char, unordered_set<char>> graph;
    unordered_map<char, int> inDeg;
    for (auto& w : words) for (char c : w) inDeg[c] = 0;
    
    for (int i = 0; i < words.size() - 1; i++) {
        string &w1 = words[i], &w2 = words[i+1];
        int minLen = min(w1.size(), w2.size());
        if (w1.size() > w2.size() && w1.substr(0, minLen) == w2.substr(0, minLen))
            return "";
        for (int j = 0; j < minLen; j++) {
            if (w1[j] != w2[j]) {
                if (!graph[w1[j]].count(w2[j])) {
                    graph[w1[j]].insert(w2[j]);
                    inDeg[w2[j]]++;
                }
                break;
            }
        }
    }
    
    queue<char> q;
    for (auto& [c, d] : inDeg) if (d == 0) q.push(c);
    string result;
    while (!q.empty()) {
        char c = q.front(); q.pop();
        result += c;
        for (char next : graph[c])
            if (--inDeg[next] == 0) q.push(next);
    }
    return result.size() == inDeg.size() ? result : "";
}`,
    timeComplexity: "O(C) where C = total chars in all words",
    spaceComplexity: "O(U + E) where U = unique chars",
    patternGuide: "Use **constraint extraction + topological sort** when:\n- Deriving order from sorted sequences\n- Building dependency graph from comparisons\n- Language/ordering reconstruction\n\nSimilar: Course Schedule II, Sequence Reconstruction"
},
{
    id: 48,
    lcNumber: 329,
    title: "Longest Increasing Path in a Matrix",
    difficulty: "Hard",
    category: "Topological Sort",
    description: "Given an `m x n` integer matrix, return the length of the longest increasing path. From each cell, you can move in four directions. You may NOT move diagonally or outside the boundary.",
    examples: [
        "Input: matrix = [[9,9,4],[6,6,8],[2,1,1]]\nOutput: 4\nExplanation: Path: 1→2→6→9",
        "Input: matrix = [[3,4,5],[3,2,6],[2,2,1]]\nOutput: 4"
    ],
    thinkingProcess: [
        { step: "DFS with memoization", detail: "For each cell, find the longest increasing path starting from it. Since paths can overlap, cache results. If we've computed cell (r,c) before, reuse it." },
        { step: "No cycle concern", detail: "Strictly increasing constraint means no cycles are possible — you can never return to a cell. So DFS won't loop. This also means the problem has optimal substructure." },
        { step: "Memo table", detail: "`dp[r][c]` = longest increasing path starting from (r,c). Initialize all to 0. Compute on demand via DFS." },
        { step: "DFS logic", detail: "For cell (r,c): if dp[r][c] > 0, return it (already computed). Otherwise, check all 4 neighbors. If neighbor value > current value, recurse. dp[r][c] = 1 + max of all valid neighbor results." },
        { step: "Alternative: Topological sort", detail: "Build a DAG where edges go from smaller to larger neighbors. Topological sort (BFS from 'leaves' — cells with no incoming edges) gives the longest path." }
    ],
    keyInsight: "DFS with memoization. Each cell's longest path = 1 + max of its valid neighbors' paths. No cycles (strictly increasing), so memoization works perfectly. Each cell computed exactly once.",
    approach: "Memoized DFS from every cell. dp[r][c] = 1 + max(dp of neighbors with larger value). Return max of all dp values.",
    solutionPython: `def longestIncreasingPath(matrix):
    if not matrix:
        return 0
    
    rows, cols = len(matrix), len(matrix[0])
    dp = [[0] * cols for _ in range(rows)]
    
    def dfs(r, c):
        if dp[r][c]:
            return dp[r][c]
        
        dp[r][c] = 1
        for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and matrix[nr][nc] > matrix[r][c]:
                dp[r][c] = max(dp[r][c], 1 + dfs(nr, nc))
        
        return dp[r][c]
    
    return max(dfs(r, c) for r in range(rows) for c in range(cols))`,
    solutionCpp: `int longestIncreasingPath(vector<vector<int>>& matrix) {
    int R = matrix.size(), C = matrix[0].size();
    vector<vector<int>> dp(R, vector<int>(C, 0));
    int dirs[] = {0,1,0,-1,0};
    
    function<int(int,int)> dfs = [&](int r, int c) -> int {
        if (dp[r][c]) return dp[r][c];
        dp[r][c] = 1;
        for (int d = 0; d < 4; d++) {
            int nr = r+dirs[d], nc = c+dirs[d+1];
            if (nr>=0 && nr<R && nc>=0 && nc<C && matrix[nr][nc] > matrix[r][c])
                dp[r][c] = max(dp[r][c], 1 + dfs(nr, nc));
        }
        return dp[r][c];
    };
    
    int ans = 0;
    for (int r = 0; r < R; r++)
        for (int c = 0; c < C; c++)
            ans = max(ans, dfs(r, c));
    return ans;
}`,
    timeComplexity: "O(m × n) — each cell computed once",
    spaceComplexity: "O(m × n)",
    patternGuide: "Use **DFS + memoization on DAG** when:\n- Finding longest/shortest path in a DAG\n- Strictly monotonic constraints prevent cycles\n- Each cell's answer depends on neighbor answers\n\nSimilar: Pacific Atlantic Water Flow, Longest Path in DAG"
},
// ============================================================
// CATEGORY: UNION FIND (Problems 49-51)
// ============================================================
{
    id: 49,
    lcNumber: 128,
    title: "Longest Consecutive Sequence",
    difficulty: "Medium",
    category: "Union Find",
    description: "Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.",
    examples: [
        "Input: nums = [100,4,200,1,3,2]\nOutput: 4\nExplanation: The longest consecutive sequence is [1,2,3,4].",
        "Input: nums = [0,3,7,2,5,8,4,6,0,1]\nOutput: 9"
    ],
    thinkingProcess: [
        { step: "Sorting would be O(n log n)", detail: "We need O(n). Can't sort. Need a different approach." },
        { step: "Hash set approach", detail: "Put all numbers in a set. For each number, check if it's the START of a sequence (i.e., num-1 is NOT in the set). If it is, count how long the sequence extends." },
        { step: "Why check for start?", detail: "If num-1 exists, then num is part of a sequence starting earlier. We'll count it when we process the start. This ensures each sequence is counted exactly once." },
        { step: "Counting the sequence", detail: "From a start number, keep incrementing and checking if num+1, num+2, ... exist in the set. Track the length." },
        { step: "Time complexity", detail: "Each number is visited at most twice: once when we check if it's a start, once when it's counted as part of a sequence. Total: O(n)." }
    ],
    keyInsight: "Use a hash set. Only start counting from the beginning of a sequence (where num-1 doesn't exist in the set). This ensures each element is processed O(1) times amortized.",
    approach: "HashSet of all numbers. For each num where num-1 is absent (sequence start), extend right counting consecutive numbers. Track max length.",
    solutionPython: `def longestConsecutive(nums):
    num_set = set(nums)
    longest = 0
    
    for num in num_set:
        # Only start counting from sequence beginning
        if num - 1 not in num_set:
            length = 1
            while num + length in num_set:
                length += 1
            longest = max(longest, length)
    
    return longest`,
    solutionCpp: `int longestConsecutive(vector<int>& nums) {
    unordered_set<int> numSet(nums.begin(), nums.end());
    int longest = 0;
    
    for (int num : numSet) {
        if (!numSet.count(num - 1)) { // sequence start
            int length = 1;
            while (numSet.count(num + length))
                length++;
            longest = max(longest, length);
        }
    }
    return longest;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    patternGuide: "Use **hash set + sequence start detection** when:\n- Finding consecutive sequences in unsorted data\n- Need O(n) time without sorting\n- Each element should be processed once\n\nAlternatively, Union-Find can group consecutive numbers.\n\nSimilar: Longest Consecutive Sequence variants, Array Nesting"
},
{
    id: 50,
    lcNumber: 721,
    title: "Accounts Merge",
    difficulty: "Medium",
    category: "Union Find",
    description: "Given a list of accounts where each account has a name and a list of emails, merge accounts that share any email. Return merged accounts with sorted emails.",
    examples: [
        "Input: accounts = [[\"John\",\"a@\",\"b@\"],[\"John\",\"c@\"],[\"John\",\"a@\",\"d@\"],[\"Mary\",\"e@\"]]\nOutput: [[\"John\",\"a@\",\"b@\",\"d@\"],[\"John\",\"c@\"],[\"Mary\",\"e@\"]]"
    ],
    thinkingProcess: [
        { step: "Graph / Union-Find problem", detail: "If two accounts share an email, they belong to the same person. This is a connected components problem: emails are nodes, accounts create edges between their emails." },
        { step: "Union-Find approach", detail: "Union all emails within the same account. After all unions, emails in the same component belong to the same person. Group by root and build result." },
        { step: "Mapping emails to accounts", detail: "Map each email to the first account index that contains it. For subsequent accounts with the same email, union that account's first email with this email." },
        { step: "Build result", detail: "After all unions, group emails by their root. For each group, sort emails and prepend the account name." },
        { step: "Union-Find optimization", detail: "Use path compression and union by rank for near-O(1) amortized operations." }
    ],
    keyInsight: "Union-Find on emails: union all emails within an account. Emails sharing an account become one component. Group by root to build merged accounts.",
    approach: "1. Union-Find on emails. 2. Union all emails in each account. 3. Group emails by root. 4. Sort and add account name.",
    solutionPython: `def accountsMerge(accounts):
    parent = {}
    
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    
    def union(x, y):
        px, py = find(x), find(y)
        if px != py:
            parent[px] = py
    
    email_to_name = {}
    
    for account in accounts:
        name = account[0]
        for email in account[1:]:
            if email not in parent:
                parent[email] = email
            email_to_name[email] = name
            union(account[1], email)
    
    # Group emails by root
    from collections import defaultdict
    groups = defaultdict(list)
    for email in parent:
        groups[find(email)].append(email)
    
    return [[email_to_name[root]] + sorted(emails) 
            for root, emails in groups.items()]`,
    solutionCpp: `class Solution {
    unordered_map<string, string> parent;
    
    string find(string x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    
    void unite(string x, string y) {
        parent[find(x)] = find(y);
    }
    
public:
    vector<vector<string>> accountsMerge(vector<vector<string>>& accounts) {
        unordered_map<string, string> emailToName;
        
        for (auto& acc : accounts) {
            for (int i = 1; i < acc.size(); i++) {
                if (!parent.count(acc[i])) parent[acc[i]] = acc[i];
                emailToName[acc[i]] = acc[0];
                unite(acc[1], acc[i]);
            }
        }
        
        unordered_map<string, set<string>> groups;
        for (auto& [email, _] : parent)
            groups[find(email)].insert(email);
        
        vector<vector<string>> result;
        for (auto& [root, emails] : groups) {
            vector<string> merged = {emailToName[root]};
            merged.insert(merged.end(), emails.begin(), emails.end());
            result.push_back(merged);
        }
        return result;
    }
};`,
    timeComplexity: "O(n α(n)) ≈ O(n) where n = total emails",
    spaceComplexity: "O(n)",
    patternGuide: "Use **Union-Find** when:\n- Merging groups by shared elements\n- Dynamic connectivity queries\n- Finding connected components incrementally\n\nSimilar: Number of Provinces, Redundant Connection, Most Stones Removed"
},
{
    id: 51,
    lcNumber: 684,
    title: "Redundant Connection",
    difficulty: "Medium",
    category: "Union Find",
    description: "A tree is a connected graph with no cycles. Given a graph that started as a tree with `n` nodes and has one additional edge, find the edge that can be removed to make it a tree again. If multiple answers, return the one that appears last in the input.",
    examples: [
        "Input: edges = [[1,2],[1,3],[2,3]]\nOutput: [2,3]",
        "Input: edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]\nOutput: [1,4]"
    ],
    thinkingProcess: [
        { step: "Tree + one edge = one cycle", detail: "A tree with n nodes has n-1 edges. Adding one more creates exactly one cycle. We need to find the edge that, when removed, breaks the cycle." },
        { step: "Union-Find detects the cycle", detail: "Process edges one by one. Union the two nodes. If they already belong to the same component (same root), this edge creates a cycle — it's the redundant edge." },
        { step: "Why the last one?", detail: "We process edges in order. The last edge that would create a cycle (both nodes already connected) is the answer. Since there's exactly one cycle, exactly one edge will trigger this." },
        { step: "Union-Find with path compression", detail: "Use path compression and union by rank for efficiency. Find operation tells us if two nodes are already connected." },
        { step: "Simplicity of approach", detail: "For each edge [u,v]: if find(u) == find(v), return this edge. Otherwise, union(u,v). First edge creating a cycle is the answer, and since there's only one cycle, it's guaranteed to be unique." }
    ],
    keyInsight: "Process edges with Union-Find. The first edge connecting two already-connected nodes creates the cycle — that's the redundant edge. Guaranteed to be the last such edge in input.",
    approach: "Union-Find: for each edge [u,v], if find(u)==find(v), return [u,v]. Otherwise union them. The cycle-creating edge is the answer.",
    solutionPython: `def findRedundantConnection(edges):
    parent = list(range(len(edges) + 1))
    rank = [0] * (len(edges) + 1)
    
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    
    def union(x, y):
        px, py = find(x), find(y)
        if px == py:
            return False
        if rank[px] < rank[py]:
            px, py = py, px
        parent[py] = px
        if rank[px] == rank[py]:
            rank[px] += 1
        return True
    
    for u, v in edges:
        if not union(u, v):
            return [u, v]`,
    solutionCpp: `class Solution {
    vector<int> parent, rank_;
    
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    
    bool unite(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false;
        if (rank_[px] < rank_[py]) swap(px, py);
        parent[py] = px;
        if (rank_[px] == rank_[py]) rank_[px]++;
        return true;
    }
    
public:
    vector<int> findRedundantConnection(vector<vector<int>>& edges) {
        int n = edges.size();
        parent.resize(n + 1);
        rank_.resize(n + 1, 0);
        iota(parent.begin(), parent.end(), 0);
        
        for (auto& e : edges)
            if (!unite(e[0], e[1]))
                return e;
        return {};
    }
};`,
    timeComplexity: "O(n α(n)) ≈ O(n)",
    spaceComplexity: "O(n)",
    patternGuide: "Use **Union-Find for cycle detection** when:\n- Adding edges to a graph incrementally\n- Need to detect when a cycle is formed\n- Finding redundant edges in a tree\n\nSimilar: Redundant Connection II, Graph Valid Tree, Number of Connected Components"
},
// ============================================================
// CATEGORY: DYNAMIC PROGRAMMING (Problems 52-66)
// ============================================================
{
    id: 52,
    lcNumber: 322,
    title: "Coin Change",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "You are given an integer array `coins` representing coin denominations and an integer `amount`. Return the fewest number of coins needed to make up that amount. If not possible, return -1.",
    examples: [
        "Input: coins = [1,2,5], amount = 11\nOutput: 3\nExplanation: 11 = 5 + 5 + 1",
        "Input: coins = [2], amount = 3\nOutput: -1"
    ],
    thinkingProcess: [
        { step: "Define the subproblem", detail: "`dp[i]` = minimum coins needed to make amount `i`. We want `dp[amount]`." },
        { step: "Recurrence", detail: "For each amount `i`, try every coin `c`. If `c <= i`, then `dp[i] = min(dp[i], dp[i - c] + 1)`. We pick the coin that leads to the fewest total coins." },
        { step: "Base case", detail: "`dp[0] = 0` (zero coins needed for amount 0). Initialize all others to infinity (unreachable)." },
        { step: "Bottom-up approach", detail: "Build dp array from 1 to amount. For each value, try all coins. This is O(amount × coins) time." },
        { step: "Trace through", detail: "coins=[1,2,5], amount=11. dp[0]=0, dp[1]=1, dp[2]=1, dp[3]=2, dp[4]=2, dp[5]=1, ..., dp[10]=2, dp[11]=min(dp[10]+1, dp[9]+1, dp[6]+1)=3." }
    ],
    keyInsight: "`dp[i] = min(dp[i-c] + 1)` for all coins c. Classic unbounded knapsack pattern. Bottom-up from 0 to amount. Answer is dp[amount] or -1 if still infinity.",
    approach: "1D DP array. dp[0]=0. For i from 1 to amount: for each coin c, dp[i] = min(dp[i], dp[i-c]+1). Return dp[amount].",
    solutionPython: `def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1`,
    solutionCpp: `int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, amount + 1);
    dp[0] = 0;
    
    for (int i = 1; i <= amount; i++)
        for (int c : coins)
            if (c <= i)
                dp[i] = min(dp[i], dp[i - c] + 1);
    
    return dp[amount] > amount ? -1 : dp[amount];
}`,
    timeComplexity: "O(amount × n) where n = number of coins",
    spaceComplexity: "O(amount)",
    patternGuide: "Use **1D DP with min/max over choices** when:\n- Minimizing/maximizing over repeated choices\n- Unbounded knapsack variant (can reuse items)\n- Each state depends on smaller states minus item size\n\nSimilar: Perfect Squares, Minimum Cost For Tickets"
},
{
    id: 53,
    lcNumber: 300,
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.",
    examples: [
        "Input: nums = [10,9,2,5,3,7,101,18]\nOutput: 4\nExplanation: The LIS is [2,3,7,101].",
        "Input: nums = [0,1,0,3,2,3]\nOutput: 4"
    ],
    thinkingProcess: [
        { step: "O(n²) DP approach", detail: "`dp[i]` = length of LIS ending at index i. For each j < i, if nums[j] < nums[i], then dp[i] = max(dp[i], dp[j]+1). Answer = max(dp)." },
        { step: "O(n log n) approach with patience sorting", detail: "Maintain a `tails` array where tails[i] = smallest tail element for all increasing subsequences of length i+1. For each num, binary search for its position in tails." },
        { step: "Binary search insight", detail: "If num > all tails: append (extends longest subsequence). Otherwise: replace the first tail ≥ num (optimizes that length's tail). The tails array is always sorted." },
        { step: "Why replacement works", detail: "Replacing a tail with a smaller value doesn't change any existing subsequence length. It just opens the possibility for longer subsequences in the future." },
        { step: "Length = len(tails)", detail: "The tails array length equals the LIS length. Note: tails itself is NOT necessarily the actual LIS, just the optimal tails." }
    ],
    keyInsight: "Patience sorting: maintain `tails` array where tails[i] is the smallest tail of any subsequence of length i+1. Binary search each new element. Final answer = len(tails).",
    approach: "For each num: binary search tails for leftmost ≥ num. If found, replace it. If not (num is largest), append. Return len(tails).",
    solutionPython: `import bisect

def lengthOfLIS(nums):
    tails = []
    
    for num in nums:
        pos = bisect.bisect_left(tails, num)
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num
    
    return len(tails)`,
    solutionCpp: `int lengthOfLIS(vector<int>& nums) {
    vector<int> tails;
    
    for (int num : nums) {
        auto it = lower_bound(tails.begin(), tails.end(), num);
        if (it == tails.end())
            tails.push_back(num);
        else
            *it = num;
    }
    return tails.size();
}`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    patternGuide: "Use **patience sorting / binary search on tails** when:\n- Finding LIS or longest non-decreasing subsequence\n- Need O(n log n) instead of O(n²)\n- Maintaining optimal tails for subsequence lengths\n\nSimilar: Russian Doll Envelopes, Number of Longest Increasing Subsequence"
},
{
    id: 54,
    lcNumber: 1143,
    title: "Longest Common Subsequence",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Given two strings `text1` and `text2`, return the length of their longest common subsequence. A subsequence is derived by deleting some (or no) characters without changing the order of remaining characters.",
    examples: [
        "Input: text1 = \"abcde\", text2 = \"ace\"\nOutput: 3\nExplanation: LCS is \"ace\".",
        "Input: text1 = \"abc\", text2 = \"def\"\nOutput: 0"
    ],
    thinkingProcess: [
        { step: "2D DP table", detail: "`dp[i][j]` = LCS of text1[0..i-1] and text2[0..j-1]. We build this table bottom-up." },
        { step: "Recurrence", detail: "If `text1[i-1] == text2[j-1]`: characters match, `dp[i][j] = dp[i-1][j-1] + 1`. Otherwise: skip one character from either string, `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`." },
        { step: "Base case", detail: "`dp[0][j] = dp[i][0] = 0` (empty string has LCS 0 with anything)." },
        { step: "Why this works", detail: "At each step, we either use the matching character (extending LCS from both shorter prefixes) or skip one character from the string that doesn't help." },
        { step: "Space optimization", detail: "Since dp[i] only depends on dp[i-1], we can use two rows instead of the full table, reducing space to O(min(m,n))." }
    ],
    keyInsight: "Classic 2D DP: if characters match, extend from diagonal `dp[i-1][j-1]+1`. If not, take max of skipping either character. Build table bottom-up.",
    approach: "2D table dp[m+1][n+1]. Fill row by row. Match: diagonal+1. Mismatch: max(left, top). Answer: dp[m][n].",
    solutionPython: `def longestCommonSubsequence(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    return dp[m][n]`,
    solutionCpp: `int longestCommonSubsequence(string text1, string text2) {
    int m = text1.size(), n = text2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++) {
            if (text1[i-1] == text2[j-1])
                dp[i][j] = dp[i-1][j-1] + 1;
            else
                dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
        }
    return dp[m][n];
}`,
    timeComplexity: "O(m × n)",
    spaceComplexity: "O(m × n), optimizable to O(min(m,n))",
    patternGuide: "Use **2D DP on two sequences** when:\n- Comparing/aligning two strings or arrays\n- Subsequence matching (LCS, edit distance, etc.)\n- Each cell depends on diagonal, left, and top\n\nSimilar: Edit Distance, Shortest Common Supersequence"
},
{
    id: 55,
    lcNumber: 72,
    title: "Edit Distance",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Given two strings `word1` and `word2`, return the minimum number of operations to convert word1 to word2. Operations: insert a character, delete a character, or replace a character.",
    examples: [
        "Input: word1 = \"horse\", word2 = \"ros\"\nOutput: 3\nExplanation: horse → rorse → rose → ros",
        "Input: word1 = \"intention\", word2 = \"execution\"\nOutput: 5"
    ],
    thinkingProcess: [
        { step: "2D DP similar to LCS", detail: "`dp[i][j]` = min operations to convert word1[0..i-1] to word2[0..j-1]." },
        { step: "If characters match", detail: "`word1[i-1] == word2[j-1]`: no operation needed. `dp[i][j] = dp[i-1][j-1]`." },
        { step: "If characters differ, three choices", detail: "Replace: `dp[i-1][j-1] + 1`. Delete from word1: `dp[i-1][j] + 1`. Insert into word1: `dp[i][j-1] + 1`. Take the minimum." },
        { step: "Base cases", detail: "`dp[i][0] = i` (delete all from word1). `dp[0][j] = j` (insert all from word2)." },
        { step: "Understand the operations", detail: "Replace = change word1[i] to match word2[j], then solve for both prefixes minus 1. Delete = remove word1[i], solve for shorter word1. Insert = add word2[j] to word1, solve for shorter word2." }
    ],
    keyInsight: "2D DP: match → free (diagonal). Mismatch → min of replace (diagonal+1), delete (top+1), insert (left+1). Base: converting to/from empty string costs string length.",
    approach: "dp[m+1][n+1] table. Base cases: dp[i][0]=i, dp[0][j]=j. Fill: match→diagonal, mismatch→1+min(diag,top,left).",
    solutionPython: `def minDistance(word1, word2):
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(m + 1): dp[i][0] = i
    for j in range(n + 1): dp[0][j] = j
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j-1],  # replace
                                   dp[i-1][j],      # delete
                                   dp[i][j-1])       # insert
    
    return dp[m][n]`,
    solutionCpp: `int minDistance(string word1, string word2) {
    int m = word1.size(), n = word2.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1));
    
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++) {
            if (word1[i-1] == word2[j-1])
                dp[i][j] = dp[i-1][j-1];
            else
                dp[i][j] = 1 + min({dp[i-1][j-1], dp[i-1][j], dp[i][j-1]});
        }
    return dp[m][n];
}`,
    timeComplexity: "O(m × n)",
    spaceComplexity: "O(m × n)",
    patternGuide: "Use **edit distance DP** when:\n- String transformation with insert/delete/replace\n- Spell checking, DNA alignment\n- Same 2D structure as LCS but with 3 operations\n\nSimilar: One Edit Distance, Delete Operation for Two Strings"
},
{
    id: 56,
    lcNumber: 312,
    title: "Burst Balloons",
    difficulty: "Hard",
    category: "Dynamic Programming",
    description: "You have `n` balloons indexed 0 to n-1 with values in `nums`. Bursting balloon `i` earns `nums[i-1] * nums[i] * nums[i+1]` coins (out-of-bounds treated as 1). Find the maximum coins you can earn by bursting all balloons.",
    examples: [
        "Input: nums = [3,1,5,8]\nOutput: 167\nExplanation: nums = [3,1,5,8] → [3,5,8] → [3,8] → [8] → []. Coins: 3*1*5 + 3*5*8 + 1*3*8 + 1*8*1 = 167."
    ],
    thinkingProcess: [
        { step: "Why standard DP fails", detail: "If we think 'which balloon to burst first,' the subproblems overlap and change based on what's already been burst. Adjacent elements change!" },
        { step: "Reverse thinking: which to burst LAST", detail: "Instead of first, think about which balloon is burst LAST in a range. If balloon k is last in range [i,j], then we know i-1 and j+1 are still present when we burst k." },
        { step: "Interval DP", detail: "`dp[i][j]` = max coins from bursting all balloons in range (i,j) exclusive. The left and right boundaries i,j are NOT burst." },
        { step: "Recurrence", detail: "For range (i,j), try each k as the LAST balloon to burst. Coins from k = nums[i]*nums[k]*nums[j]. Then dp[i][j] = max(dp[i][k] + dp[k][j] + nums[i]*nums[k]*nums[j]) for all k in (i,j)." },
        { step: "Padding", detail: "Add 1 to both ends of nums: [1, ...nums..., 1]. Now dp[0][n+1] is the answer. Iterate by interval length from small to large." }
    ],
    keyInsight: "Think about which balloon to burst LAST in a range. When balloon k is last in range (i,j), boundaries i,j are still present: coins = nums[i]*nums[k]*nums[j]. Interval DP: dp[i][j] = max over all k.",
    approach: "Pad nums with 1s. Interval DP: for each interval length, for each start, try each k as last burst. dp[i][j] = max(dp[i][k] + dp[k][j] + nums[i]*nums[k]*nums[j]).",
    solutionPython: `def maxCoins(nums):
    nums = [1] + nums + [1]
    n = len(nums)
    dp = [[0] * n for _ in range(n)]
    
    for length in range(2, n):  # interval length
        for i in range(n - length):
            j = i + length
            for k in range(i + 1, j):  # last balloon to burst
                dp[i][j] = max(dp[i][j],
                    dp[i][k] + dp[k][j] + nums[i] * nums[k] * nums[j])
    
    return dp[0][n - 1]`,
    solutionCpp: `int maxCoins(vector<int>& nums) {
    nums.insert(nums.begin(), 1);
    nums.push_back(1);
    int n = nums.size();
    vector<vector<int>> dp(n, vector<int>(n, 0));
    
    for (int len = 2; len < n; len++)
        for (int i = 0; i + len < n; i++) {
            int j = i + len;
            for (int k = i + 1; k < j; k++)
                dp[i][j] = max(dp[i][j],
                    dp[i][k] + dp[k][j] + nums[i]*nums[k]*nums[j]);
        }
    return dp[0][n-1];
}`,
    timeComplexity: "O(n³)",
    spaceComplexity: "O(n²)",
    patternGuide: "Use **interval DP (last element in range)** when:\n- Order of removal/processing matters\n- Boundaries change as elements are removed\n- Thinking about what's LAST simplifies subproblems\n\nSimilar: Minimum Cost to Merge Stones, Strange Printer, Minimum Score Triangulation"
},
{
    id: 57,
    lcNumber: 10,
    title: "Regular Expression Matching",
    difficulty: "Hard",
    category: "Dynamic Programming",
    description: "Given a string `s` and a pattern `p`, implement regular expression matching with `.` (matches any single character) and `*` (matches zero or more of the preceding element).",
    examples: [
        "Input: s = \"aa\", p = \"a*\"\nOutput: true\nExplanation: '*' means zero or more of 'a'. \"a*\" matches \"aa\".",
        "Input: s = \"ab\", p = \".*\"\nOutput: true\nExplanation: \".*\" means zero or more of any character."
    ],
    thinkingProcess: [
        { step: "2D DP on two strings", detail: "`dp[i][j]` = whether s[0..i-1] matches p[0..j-1]. We need dp[m][n] where m=len(s), n=len(p)." },
        { step: "Handle '.' easily", detail: "`.` matches any character. If p[j-1] is '.', treat it the same as a character match." },
        { step: "Handle '*' carefully", detail: "`*` modifies the PRECEDING character. So p[j-1]='*' means 'zero or more of p[j-2]'. Two cases: (a) zero occurrences: dp[i][j] = dp[i][j-2]. (b) one+ occurrences: if s[i-1] matches p[j-2], dp[i][j] |= dp[i-1][j]." },
        { step: "Base cases", detail: "dp[0][0] = true (empty matches empty). dp[0][j] can be true if pattern is like 'a*b*' (all stars consuming zero). dp[i][0] = false for i>0." },
        { step: "Match condition", detail: "Two characters match if they're equal or pattern char is '.'. This simplifies the logic." }
    ],
    keyInsight: "2D DP. Key case is '*': either use zero of preceding char (skip 2 in pattern: dp[i][j-2]) or use one more if current chars match (dp[i-1][j]). The '.' simply matches any character.",
    approach: "dp[m+1][n+1]. Base: dp[0][0]=true, handle star patterns at dp[0][j]. Fill: match → dp[i-1][j-1]. Star → dp[i][j-2] or dp[i-1][j] if chars match.",
    solutionPython: `def isMatch(s, p):
    m, n = len(s), len(p)
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True
    
    # Handle patterns like a*, a*b*, etc.
    for j in range(2, n + 1):
        if p[j-1] == '*':
            dp[0][j] = dp[0][j-2]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j-1] == '*':
                # Zero occurrences of preceding char
                dp[i][j] = dp[i][j-2]
                # One or more: if current char matches preceding
                if p[j-2] == '.' or p[j-2] == s[i-1]:
                    dp[i][j] = dp[i][j] or dp[i-1][j]
            elif p[j-1] == '.' or p[j-1] == s[i-1]:
                dp[i][j] = dp[i-1][j-1]
    
    return dp[m][n]`,
    solutionCpp: `bool isMatch(string s, string p) {
    int m = s.size(), n = p.size();
    vector<vector<bool>> dp(m+1, vector<bool>(n+1, false));
    dp[0][0] = true;
    
    for (int j = 2; j <= n; j++)
        if (p[j-1] == '*') dp[0][j] = dp[0][j-2];
    
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++) {
            if (p[j-1] == '*') {
                dp[i][j] = dp[i][j-2]; // zero matches
                if (p[j-2] == '.' || p[j-2] == s[i-1])
                    dp[i][j] = dp[i][j] || dp[i-1][j]; // 1+ matches
            } else if (p[j-1] == '.' || p[j-1] == s[i-1]) {
                dp[i][j] = dp[i-1][j-1];
            }
        }
    return dp[m][n];
}`,
    timeComplexity: "O(m × n)",
    spaceComplexity: "O(m × n)",
    patternGuide: "Use **2D DP for pattern matching** when:\n- Matching string against pattern with special chars\n- '*' or '?' wildcards\n- Each state depends on whether chars match + pattern rules\n\nSimilar: Wildcard Matching, Distinct Subsequences"
},
{
    id: 58,
    lcNumber: 97,
    title: "Interleaving String",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Given strings `s1`, `s2`, and `s3`, determine whether `s3` is formed by interleaving `s1` and `s2`. An interleaving preserves the relative order of characters within each string.",
    examples: [
        "Input: s1 = \"aabcc\", s2 = \"dbbca\", s3 = \"aadbbcbcac\"\nOutput: true",
        "Input: s1 = \"aabcc\", s2 = \"dbbca\", s3 = \"aadbbbaccc\"\nOutput: false"
    ],
    thinkingProcess: [
        { step: "Quick check", detail: "If `len(s1) + len(s2) != len(s3)`, immediately return false." },
        { step: "2D DP formulation", detail: "`dp[i][j]` = can s1[0..i-1] and s2[0..j-1] interleave to form s3[0..i+j-1]? We consume i chars from s1 and j chars from s2." },
        { step: "Recurrence", detail: "dp[i][j] is true if: (a) dp[i-1][j] is true AND s1[i-1] == s3[i+j-1], or (b) dp[i][j-1] is true AND s2[j-1] == s3[i+j-1]. Either the last char came from s1 or s2." },
        { step: "Base case", detail: "dp[0][0] = true. dp[i][0] = s1[0..i-1] matches s3[0..i-1]. dp[0][j] = s2[0..j-1] matches s3[0..j-1]." },
        { step: "Space optimization", detail: "Since dp[i][j] depends only on dp[i-1][j] and dp[i][j-1], we can use a 1D array." }
    ],
    keyInsight: "2D DP where dp[i][j] = can we form s3[0..i+j-1] using i chars from s1 and j from s2. Each character of s3 must come from either s1 or s2 in order.",
    approach: "dp[m+1][n+1]. dp[i][j] = true if s3's (i+j)th char matches s1's ith (from top) or s2's jth (from left). Fill left-to-right, top-to-bottom.",
    solutionPython: `def isInterleave(s1, s2, s3):
    m, n = len(s1), len(s2)
    if m + n != len(s3):
        return False
    
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True
    
    for i in range(1, m + 1):
        dp[i][0] = dp[i-1][0] and s1[i-1] == s3[i-1]
    for j in range(1, n + 1):
        dp[0][j] = dp[0][j-1] and s2[j-1] == s3[j-1]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            dp[i][j] = ((dp[i-1][j] and s1[i-1] == s3[i+j-1]) or
                        (dp[i][j-1] and s2[j-1] == s3[i+j-1]))
    
    return dp[m][n]`,
    solutionCpp: `bool isInterleave(string s1, string s2, string s3) {
    int m = s1.size(), n = s2.size();
    if (m + n != s3.size()) return false;
    
    vector<vector<bool>> dp(m+1, vector<bool>(n+1, false));
    dp[0][0] = true;
    for (int i = 1; i <= m; i++) dp[i][0] = dp[i-1][0] && s1[i-1]==s3[i-1];
    for (int j = 1; j <= n; j++) dp[0][j] = dp[0][j-1] && s2[j-1]==s3[j-1];
    
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            dp[i][j] = (dp[i-1][j] && s1[i-1]==s3[i+j-1]) ||
                       (dp[i][j-1] && s2[j-1]==s3[i+j-1]);
    return dp[m][n];
}`,
    timeComplexity: "O(m × n)",
    spaceComplexity: "O(m × n)",
    patternGuide: "Use **2D DP for interleaving/merging** when:\n- Checking if two sequences can merge into a third\n- Preserving relative order from both sources\n- Grid represents consumption from each source\n\nSimilar: Distinct Subsequences, Shortest Common Supersequence"
},
{
    id: 59,
    lcNumber: 516,
    title: "Longest Palindromic Subsequence",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Given a string `s`, find the longest palindromic subsequence's length.",
    examples: [
        "Input: s = \"bbbab\"\nOutput: 4\nExplanation: \"bbbb\" is the longest palindromic subsequence.",
        "Input: s = \"cbbd\"\nOutput: 2\nExplanation: \"bb\"."
    ],
    thinkingProcess: [
        { step: "Interval DP", detail: "`dp[i][j]` = longest palindromic subsequence in s[i..j]. We want dp[0][n-1]." },
        { step: "Recurrence", detail: "If `s[i] == s[j]`: dp[i][j] = dp[i+1][j-1] + 2 (both ends contribute). If `s[i] != s[j]`: dp[i][j] = max(dp[i+1][j], dp[i][j-1]) (skip one end)." },
        { step: "Base case", detail: "dp[i][i] = 1 (single char is palindrome of length 1). dp[i][i-1] = 0 (empty, for when i > j)." },
        { step: "Fill order", detail: "Fill by increasing interval length: length 1 (base), then 2, 3, ..., n." },
        { step: "Alternative: LCS with reverse", detail: "LPS(s) = LCS(s, reverse(s)). This reduces to the LCS problem! Elegant but uses O(n²) space." }
    ],
    keyInsight: "Interval DP: if endpoints match, both contribute (+2). If not, try excluding either end. OR equivalently: LPS(s) = LCS(s, reverse(s)).",
    approach: "Interval DP: dp[i][j] for substring s[i..j]. Fill by length. Match: dp[i+1][j-1]+2. No match: max(dp[i+1][j], dp[i][j-1]).",
    solutionPython: `def longestPalindromeSubseq(s):
    n = len(s)
    dp = [[0] * n for _ in range(n)]
    
    for i in range(n):
        dp[i][i] = 1
    
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if s[i] == s[j]:
                dp[i][j] = dp[i+1][j-1] + 2
            else:
                dp[i][j] = max(dp[i+1][j], dp[i][j-1])
    
    return dp[0][n-1]`,
    solutionCpp: `int longestPalindromeSubseq(string s) {
    int n = s.size();
    vector<vector<int>> dp(n, vector<int>(n, 0));
    
    for (int i = 0; i < n; i++) dp[i][i] = 1;
    
    for (int len = 2; len <= n; len++)
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            if (s[i] == s[j])
                dp[i][j] = dp[i+1][j-1] + 2;
            else
                dp[i][j] = max(dp[i+1][j], dp[i][j-1]);
        }
    return dp[0][n-1];
}`,
    timeComplexity: "O(n²)",
    spaceComplexity: "O(n²)",
    patternGuide: "Use **interval DP on palindromes** when:\n- Finding longest/count of palindromic subsequences\n- Both ends of substring interact\n- Build up from small intervals to full string\n\nSimilar: Longest Palindromic Substring, Palindrome Partitioning, Count Palindromic Subsequences"
},
{
    id: 60,
    lcNumber: 1235,
    title: "Maximum Profit in Job Scheduling",
    difficulty: "Hard",
    category: "Dynamic Programming",
    description: "You have `n` jobs with `startTime`, `endTime`, and `profit`. Find the maximum profit you can achieve such that no two selected jobs overlap. You may start a job at the same time another ends.",
    examples: [
        "Input: startTime = [1,2,3,3], endTime = [3,4,5,6], profit = [50,10,40,70]\nOutput: 120\nExplanation: Pick jobs 1 and 4: profit = 50 + 70 = 120."
    ],
    thinkingProcess: [
        { step: "Sort by end time", detail: "Sort jobs by end time. This lets us use DP where dp[i] = max profit using jobs 0..i." },
        { step: "For each job: include or exclude", detail: "dp[i] = max(exclude job i, include job i). Exclude: dp[i-1]. Include: profit[i] + dp[last non-conflicting job]." },
        { step: "Binary search for non-conflicting", detail: "The last non-conflicting job is the latest job that ends ≤ start time of job i. Since sorted by end time, use binary search!" },
        { step: "DP recurrence", detail: "dp[i] = max(dp[i-1], profit[i] + dp[j]) where j is found by binary search on end times." },
        { step: "Implementation", detail: "Sort by end time. dp array where dp[i] = max profit considering first i jobs. Binary search for each job to find last compatible." }
    ],
    keyInsight: "Sort by end time. For each job: max(skip it, take it + best compatible profit). Binary search finds the latest non-conflicting job efficiently. Classic weighted job scheduling.",
    approach: "Sort by end time. DP: dp[i] = max(dp[i-1], profit[i] + dp[binary_search(start[i])]). Binary search for last job ending ≤ start[i].",
    solutionPython: `import bisect

def jobScheduling(startTime, endTime, profit):
    jobs = sorted(zip(endTime, startTime, profit))
    n = len(jobs)
    dp = [0] * (n + 1)
    ends = [j[0] for j in jobs]
    
    for i in range(1, n + 1):
        end, start, prof = jobs[i-1]
        # Find last job ending <= start
        j = bisect.bisect_right(ends, start, 0, i) 
        dp[i] = max(dp[i-1], prof + dp[j])
    
    return dp[n]`,
    solutionCpp: `int jobScheduling(vector<int>& startTime, vector<int>& endTime, vector<int>& profit) {
    int n = startTime.size();
    vector<array<int,3>> jobs(n);
    for (int i = 0; i < n; i++)
        jobs[i] = {endTime[i], startTime[i], profit[i]};
    sort(jobs.begin(), jobs.end());
    
    vector<int> dp(n+1, 0), ends(n);
    for (int i = 0; i < n; i++) ends[i] = jobs[i][0];
    
    for (int i = 1; i <= n; i++) {
        int start = jobs[i-1][1], prof = jobs[i-1][2];
        int j = upper_bound(ends.begin(), ends.begin()+i, start) - ends.begin();
        dp[i] = max(dp[i-1], prof + dp[j]);
    }
    return dp[n];
}`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    patternGuide: "Use **DP + binary search on sorted intervals** when:\n- Weighted interval scheduling (maximize profit)\n- Non-overlapping selection with values\n- Include/exclude decision with efficient lookup\n\nSimilar: Non-overlapping Intervals, Meeting Rooms II (as DP variant)"
},
{
    id: 61,
    lcNumber: 44,
    title: "Wildcard Matching",
    difficulty: "Hard",
    category: "Dynamic Programming",
    description: "Given a string `s` and a pattern `p`, implement wildcard matching where `?` matches any single character and `*` matches any sequence of characters (including empty).",
    examples: [
        "Input: s = \"cb\", p = \"?a\"\nOutput: false",
        "Input: s = \"adceb\", p = \"*a*b\"\nOutput: true"
    ],
    thinkingProcess: [
        { step: "Similar to regex matching", detail: "2D DP: dp[i][j] = does s[0..i-1] match p[0..j-1]?" },
        { step: "Handle '?'", detail: "'?' matches any single character. If p[j-1]=='?', dp[i][j] = dp[i-1][j-1]." },
        { step: "Handle '*'", detail: "'*' matches any sequence. Two choices: (a) '*' matches empty: dp[i][j] = dp[i][j-1]. (b) '*' matches one more char: dp[i][j] = dp[i-1][j]." },
        { step: "Regular character", detail: "If p[j-1]==s[i-1], dp[i][j] = dp[i-1][j-1]. Otherwise false." },
        { step: "Base cases", detail: "dp[0][0] = true. dp[0][j] = true only if p[0..j-1] is all '*'. dp[i][0] = false for i>0." }
    ],
    keyInsight: "2D DP. `*` can match empty (dp[i][j-1]) or consume one char (dp[i-1][j]). `?` matches any single char (dp[i-1][j-1]). Same structure as regex matching but simpler since `*` is standalone.",
    approach: "dp[m+1][n+1]. Base: dp[0][0]=true, stars at start can match empty. Fill: ?→diagonal, *→(top or left), char→diagonal if match.",
    solutionPython: `def isMatch(s, p):
    m, n = len(s), len(p)
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True
    
    for j in range(1, n + 1):
        if p[j-1] == '*':
            dp[0][j] = dp[0][j-1]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j-1] == '*':
                dp[i][j] = dp[i][j-1] or dp[i-1][j]
            elif p[j-1] == '?' or p[j-1] == s[i-1]:
                dp[i][j] = dp[i-1][j-1]
    
    return dp[m][n]`,
    solutionCpp: `bool isMatch(string s, string p) {
    int m = s.size(), n = p.size();
    vector<vector<bool>> dp(m+1, vector<bool>(n+1, false));
    dp[0][0] = true;
    for (int j = 1; j <= n; j++)
        if (p[j-1] == '*') dp[0][j] = dp[0][j-1];
    
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++) {
            if (p[j-1] == '*')
                dp[i][j] = dp[i][j-1] || dp[i-1][j];
            else if (p[j-1] == '?' || p[j-1] == s[i-1])
                dp[i][j] = dp[i-1][j-1];
        }
    return dp[m][n];
}`,
    timeComplexity: "O(m × n)",
    spaceComplexity: "O(m × n)",
    patternGuide: "Use **2D DP for wildcard/regex** when:\n- Pattern matching with wildcards\n- '*' matches variable-length sequences\n- '?' matches single characters\n\nSimilar: Regular Expression Matching, Distinct Subsequences"
},
{
    id: 62,
    lcNumber: 188,
    title: "Best Time to Buy and Sell Stock IV",
    difficulty: "Hard",
    category: "Dynamic Programming",
    description: "You are given an array `prices` and an integer `k` (max transactions). Find the maximum profit. You may complete at most `k` transactions (buy before sell, can't hold multiple stocks).",
    examples: [
        "Input: k = 2, prices = [2,4,1]\nOutput: 2\nExplanation: Buy day 1, sell day 2. Profit = 2.",
        "Input: k = 2, prices = [3,2,6,5,0,3]\nOutput: 7\nExplanation: Buy day 2, sell day 3 (profit 4). Buy day 5, sell day 6 (profit 3)."
    ],
    thinkingProcess: [
        { step: "State definition", detail: "dp[t][d] = max profit using at most t transactions up to day d. But we also need to track if we're holding a stock." },
        { step: "Better state", detail: "dp[t][d][0] = max profit on day d with t transactions done, not holding. dp[t][d][1] = holding. But this is 3D." },
        { step: "Optimize", detail: "For each transaction count t: track buy[t] and sell[t]. buy[t] = max profit in state 'bought for t-th transaction'. sell[t] = max profit after selling in t-th transaction." },
        { step: "Transitions", detail: "buy[t] = max(buy[t], sell[t-1] - price). sell[t] = max(sell[t], buy[t] + price). Process for each day, for each t." },
        { step: "Special case: k ≥ n/2", detail: "If k is large enough, we can do unlimited transactions (greedy: take all profitable consecutive pairs)." }
    ],
    keyInsight: "Track buy/sell states for each of k transactions. buy[j] = max(buy[j], sell[j-1]-price). sell[j] = max(sell[j], buy[j]+price). If k ≥ n/2, use greedy for unlimited transactions.",
    approach: "If k ≥ n/2: greedy. Otherwise: for each day, update buy[j] and sell[j] for j=1..k.",
    solutionPython: `def maxProfit(k, prices):
    n = len(prices)
    if not prices or k == 0:
        return 0
    
    # If k >= n/2, unlimited transactions
    if k >= n // 2:
        return sum(max(0, prices[i+1]-prices[i]) for i in range(n-1))
    
    buy = [float('-inf')] * (k + 1)
    sell = [0] * (k + 1)
    
    for price in prices:
        for j in range(1, k + 1):
            buy[j] = max(buy[j], sell[j-1] - price)
            sell[j] = max(sell[j], buy[j] + price)
    
    return sell[k]`,
    solutionCpp: `int maxProfit(int k, vector<int>& prices) {
    int n = prices.size();
    if (n == 0 || k == 0) return 0;
    
    if (k >= n / 2) {
        int profit = 0;
        for (int i = 1; i < n; i++)
            profit += max(0, prices[i] - prices[i-1]);
        return profit;
    }
    
    vector<int> buy(k+1, INT_MIN), sell(k+1, 0);
    for (int price : prices)
        for (int j = 1; j <= k; j++) {
            buy[j] = max(buy[j], sell[j-1] - price);
            sell[j] = max(sell[j], buy[j] + price);
        }
    return sell[k];
}`,
    timeComplexity: "O(n × k)",
    spaceComplexity: "O(k)",
    patternGuide: "Use **state machine DP** when:\n- Stock buy/sell problems with constraints\n- States: holding/not holding, transaction count\n- Transitions: buy, sell, hold\n\nSimilar: Best Time to Buy and Sell Stock I/II/III, With Cooldown, With Transaction Fee"
},
{
    id: 63,
    lcNumber: 1444,
    title: "Number of Ways of Cutting a Pizza",
    difficulty: "Hard",
    category: "Dynamic Programming",
    description: "Given a rectangular pizza represented as a `rows x cols` matrix of `'A'` (apple) and `'.'` (empty), cut it `k-1` times to get `k` pieces. Each cut is horizontal or vertical through the whole pizza. Each piece must contain at least one apple. Return the number of ways to cut (mod 10^9+7).",
    examples: [
        "Input: pizza = [\"A..\",\"AAA\",\"...\"], k = 3\nOutput: 3"
    ],
    thinkingProcess: [
        { step: "State definition", detail: "dp[r][c][cuts] = number of ways to cut the sub-pizza starting at (r,c) to bottom-right, with `cuts` cuts remaining." },
        { step: "Prefix sum for apple count", detail: "We need to quickly check if a rectangle contains apples. Use a 2D prefix sum: `apples[r][c]` = count of apples in rectangle from (r,c) to (rows-1, cols-1)." },
        { step: "Horizontal cut", detail: "Cut at row `nr` (nr > r): upper piece is rows [r, nr). It must have ≥1 apple. Remaining: dp[nr][c][cuts-1]." },
        { step: "Vertical cut", detail: "Cut at column `nc` (nc > c): left piece is cols [c, nc). Must have ≥1 apple. Remaining: dp[r][nc][cuts-1]." },
        { step: "Base case", detail: "cuts=0: check if remaining piece has ≥1 apple. If yes: 1 way. If no: 0 ways." }
    ],
    keyInsight: "3D DP (row, col, cuts remaining) + 2D prefix sum for fast apple counting. Try all horizontal and vertical cuts, ensuring each piece has apples. Memoize results.",
    approach: "Precompute suffix apple counts. dp[r][c][cuts]: try all row cuts and col cuts, sum valid ways. Base: cuts=0, check apples exist.",
    solutionPython: `def ways(pizza, k):
    MOD = 10**9 + 7
    R, C = len(pizza), len(pizza[0])
    
    # Suffix sum of apples from (r,c) to (R-1,C-1)
    apples = [[0]*(C+1) for _ in range(R+1)]
    for r in range(R-1, -1, -1):
        for c in range(C-1, -1, -1):
            apples[r][c] = (1 if pizza[r][c]=='A' else 0) + apples[r+1][c] + apples[r][c+1] - apples[r+1][c+1]
    
    from functools import lru_cache
    @lru_cache(maxsize=None)
    def dp(r, c, cuts):
        if apples[r][c] == 0: return 0
        if cuts == 0: return 1
        
        total = 0
        for nr in range(r+1, R):
            if apples[r][c] - apples[nr][c] > 0:
                total = (total + dp(nr, c, cuts-1)) % MOD
        for nc in range(c+1, C):
            if apples[r][c] - apples[r][nc] > 0:
                total = (total + dp(r, nc, cuts-1)) % MOD
        return total
    
    return dp(0, 0, k-1)`,
    solutionCpp: `int ways(vector<string>& pizza, int k) {
    int R = pizza.size(), C = pizza[0].size(), MOD = 1e9+7;
    vector<vector<int>> apples(R+1, vector<int>(C+1, 0));
    for (int r = R-1; r >= 0; r--)
        for (int c = C-1; c >= 0; c--)
            apples[r][c] = (pizza[r][c]=='A') + apples[r+1][c] + apples[r][c+1] - apples[r+1][c+1];
    
    vector<vector<vector<int>>> dp(R, vector<vector<int>>(C, vector<int>(k, -1)));
    
    function<int(int,int,int)> solve = [&](int r, int c, int cuts) -> int {
        if (apples[r][c] == 0) return 0;
        if (cuts == 0) return 1;
        if (dp[r][c][cuts] != -1) return dp[r][c][cuts];
        long total = 0;
        for (int nr = r+1; nr < R; nr++)
            if (apples[r][c] - apples[nr][c] > 0)
                total += solve(nr, c, cuts-1);
        for (int nc = c+1; nc < C; nc++)
            if (apples[r][c] - apples[r][nc] > 0)
                total += solve(r, nc, cuts-1);
        return dp[r][c][cuts] = total % MOD;
    };
    return solve(0, 0, k-1);
}`,
    timeComplexity: "O(R × C × k × (R + C))",
    spaceComplexity: "O(R × C × k)",
    patternGuide: "Use **3D DP + prefix sums** when:\n- Cutting/partitioning a 2D region with constraints\n- Need fast region queries (prefix sums)\n- State = position + remaining operations\n\nSimilar: Cherry Pickup, Minimum Cost to Cut a Stick"
},
{
    id: 64,
    lcNumber: 920,
    title: "Number of Music Playlists",
    difficulty: "Hard",
    category: "Dynamic Programming",
    description: "Find the number of possible playlists of length `goal` from `n` different songs, where every song is played at least once and a song can only be replayed after `k` other songs have been played. Return result mod 10^9+7.",
    examples: [
        "Input: n = 3, goal = 3, k = 1\nOutput: 6\nExplanation: All permutations of 3 songs = 6."
    ],
    thinkingProcess: [
        { step: "State definition", detail: "dp[i][j] = number of playlists of length i using exactly j unique songs." },
        { step: "Adding a new song", detail: "Play a song never played before: dp[i][j] += dp[i-1][j-1] × (n - j + 1). We have (n-j+1) new songs to choose from." },
        { step: "Replaying an old song", detail: "Play a song we've played before (but not in the last k): dp[i][j] += dp[i-1][j] × max(j - k, 0). We have j unique songs but k are on cooldown." },
        { step: "Base case", detail: "dp[0][0] = 1 (empty playlist with 0 songs)." },
        { step: "Answer", detail: "dp[goal][n] — playlist of length goal using all n songs." }
    ],
    keyInsight: "dp[i][j] = playlists of length i with j unique songs. Two transitions: add new song (n-j+1 choices) or replay old (max(j-k,0) choices). Answer: dp[goal][n].",
    approach: "2D DP. dp[i][j] = dp[i-1][j-1]*(n-j+1) + dp[i-1][j]*max(j-k,0). Build up to dp[goal][n].",
    solutionPython: `def numMusicPlaylists(n, goal, k):
    MOD = 10**9 + 7
    dp = [[0] * (n + 1) for _ in range(goal + 1)]
    dp[0][0] = 1
    
    for i in range(1, goal + 1):
        for j in range(1, n + 1):
            # New song
            dp[i][j] = dp[i-1][j-1] * (n - j + 1) % MOD
            # Old song (not in last k)
            dp[i][j] = (dp[i][j] + dp[i-1][j] * max(j - k, 0)) % MOD
    
    return dp[goal][n]`,
    solutionCpp: `int numMusicPlaylists(int n, int goal, int k) {
    long MOD = 1e9 + 7;
    vector<vector<long>> dp(goal+1, vector<long>(n+1, 0));
    dp[0][0] = 1;
    
    for (int i = 1; i <= goal; i++)
        for (int j = 1; j <= n; j++) {
            dp[i][j] = dp[i-1][j-1] * (n-j+1) % MOD;
            dp[i][j] = (dp[i][j] + dp[i-1][j] * max(j-k, 0)) % MOD;
        }
    return dp[goal][n];
}`,
    timeComplexity: "O(goal × n)",
    spaceComplexity: "O(goal × n)",
    patternGuide: "Use **counting DP with choices** when:\n- Counting arrangements with constraints\n- Each step has multiple options (new vs repeat)\n- Combinatorial problems with ordering\n\nSimilar: Distinct Subsequences, Number of Dice Rolls"
},
{
    id: 65,
    lcNumber: 887,
    title: "Super Egg Drop",
    difficulty: "Hard",
    category: "Dynamic Programming",
    description: "You are given `k` identical eggs and a building with `n` floors. Find the minimum number of moves to determine with certainty the critical floor (the highest floor from which an egg can be dropped without breaking).",
    examples: [
        "Input: k = 1, n = 2\nOutput: 2\nExplanation: Drop from floor 1. If breaks, F=0. If not, drop from 2.",
        "Input: k = 2, n = 6\nOutput: 3"
    ],
    thinkingProcess: [
        { step: "Reframe the problem", detail: "Instead of 'min moves for n floors,' ask: 'given k eggs and t moves, what's the maximum floors we can check?' Find smallest t where this ≥ n." },
        { step: "DP: dp[t][k] = max floors checkable", detail: "With t moves and k eggs, drop from floor dp[t-1][k-1]+1. If breaks: check dp[t-1][k-1] floors below (t-1 moves, k-1 eggs). If survives: check dp[t-1][k] floors above (t-1 moves, k eggs)." },
        { step: "Recurrence", detail: "dp[t][k] = dp[t-1][k-1] + dp[t-1][k] + 1. The +1 is for the floor we just dropped from." },
        { step: "Base cases", detail: "dp[0][k] = 0 (no moves, check 0 floors). dp[t][0] = 0 (no eggs, check 0 floors). dp[t][1] = t (1 egg, must go floor by floor)." },
        { step: "Answer", detail: "Find smallest t where dp[t][k] >= n." }
    ],
    keyInsight: "Reverse the question: dp[t][k] = max floors with t moves and k eggs. dp[t][k] = dp[t-1][k-1] + dp[t-1][k] + 1 (break + no break + current floor). Find min t where dp[t][k] ≥ n.",
    approach: "Build dp[t][k] incrementally for t=1,2,... Stop when dp[t][k] >= n. Return t.",
    solutionPython: `def superEggDrop(k, n):
    dp = [[0] * (k + 1) for _ in range(n + 1)]
    
    t = 0
    while dp[t][k] < n:
        t += 1
        for eggs in range(1, k + 1):
            dp[t][eggs] = dp[t-1][eggs-1] + dp[t-1][eggs] + 1
    
    return t`,
    solutionCpp: `int superEggDrop(int k, int n) {
    // dp[t][eggs] = max floors we can check
    vector<vector<int>> dp(n+1, vector<int>(k+1, 0));
    int t = 0;
    while (dp[t][k] < n) {
        t++;
        for (int e = 1; e <= k; e++)
            dp[t][e] = dp[t-1][e-1] + dp[t-1][e] + 1;
    }
    return t;
}`,
    timeComplexity: "O(t × k) where t ≈ O(n^(1/k))",
    spaceComplexity: "O(n × k), optimizable to O(k)",
    patternGuide: "Use **reverse-thinking DP** when:\n- Direct DP has hard-to-optimize recurrence\n- Swapping 'what' and 'how many' simplifies\n- Binary search/decision problems (egg drop, etc.)\n\nSimilar: Other egg drop variants, minimizing worst-case scenarios"
},
{
    id: 66,
    lcNumber: 1547,
    title: "Minimum Cost to Cut a Stick",
    difficulty: "Hard",
    category: "Dynamic Programming",
    description: "Given a wooden stick of length `n` and an array `cuts` of positions to cut. Each cut costs the length of the stick being cut. Return the minimum total cost to make all cuts.",
    examples: [
        "Input: n = 7, cuts = [1,3,4,5]\nOutput: 16\nExplanation: Optimal order: cut at 3 (cost 7), then 5 (cost 4), then 1 (cost 3), then 4 (cost 2). Total = 16."
    ],
    thinkingProcess: [
        { step: "Order matters", detail: "Cutting in different orders gives different costs because cost = length of current piece. This is similar to Burst Balloons — order of operations matters." },
        { step: "Interval DP", detail: "Sort cuts, add 0 and n as boundaries. dp[i][j] = min cost to make all cuts between boundary i and boundary j." },
        { step: "Recurrence", detail: "For each possible first cut k between i and j: cost = (cuts[j] - cuts[i]) + dp[i][k] + dp[k][j]. The (cuts[j]-cuts[i]) is the cost of this cut (length of piece). Take the minimum over all k." },
        { step: "Base case", detail: "dp[i][i+1] = 0 (no cuts between adjacent boundaries)." },
        { step: "Fill by interval length", detail: "Start with small intervals, build up to dp[0][len(cuts)-1]." }
    ],
    keyInsight: "Interval DP like Burst Balloons. Sort cuts, add boundaries 0 and n. dp[i][j] = min over all cuts k in (i,j) of (length + dp[i][k] + dp[k][j]). Length = cuts[j] - cuts[i].",
    approach: "Sort cuts, add 0 and n. Interval DP: dp[i][j] = min over k of (cuts[j]-cuts[i] + dp[i][k] + dp[k][j]).",
    solutionPython: `def minCost(n, cuts):
    cuts = sorted([0] + cuts + [n])
    m = len(cuts)
    dp = [[0] * m for _ in range(m)]
    
    for length in range(2, m):
        for i in range(m - length):
            j = i + length
            dp[i][j] = float('inf')
            for k in range(i + 1, j):
                dp[i][j] = min(dp[i][j], 
                    cuts[j] - cuts[i] + dp[i][k] + dp[k][j])
    
    return dp[0][m - 1]`,
    solutionCpp: `int minCost(int n, vector<int>& cuts) {
    cuts.push_back(0);
    cuts.push_back(n);
    sort(cuts.begin(), cuts.end());
    int m = cuts.size();
    vector<vector<int>> dp(m, vector<int>(m, 0));
    
    for (int len = 2; len < m; len++)
        for (int i = 0; i + len < m; i++) {
            int j = i + len;
            dp[i][j] = INT_MAX;
            for (int k = i+1; k < j; k++)
                dp[i][j] = min(dp[i][j], cuts[j]-cuts[i] + dp[i][k] + dp[k][j]);
        }
    return dp[0][m-1];
}`,
    timeComplexity: "O(m³) where m = cuts.length",
    spaceComplexity: "O(m²)",
    patternGuide: "Use **interval DP** when:\n- Cost depends on order of operations\n- Splitting a range at different points\n- Each split has a cost proportional to range size\n\nSimilar: Burst Balloons, Matrix Chain Multiplication, Optimal BST"
},
// ============================================================
// CATEGORY: BACKTRACKING (Problems 67-71)
// ============================================================
{
    id: 67,
    lcNumber: 22,
    title: "Generate Parentheses",
    difficulty: "Medium",
    category: "Backtracking",
    description: "Given `n` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
    examples: [
        "Input: n = 3\nOutput: [\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]",
        "Input: n = 1\nOutput: [\"()\"]"
    ],
    thinkingProcess: [
        { step: "What makes parentheses valid?", detail: "At every point, count of '(' ≥ count of ')'. Total: exactly n '(' and n ')'. We build the string character by character." },
        { step: "Decision at each step", detail: "Add '(' if openCount < n. Add ')' if closeCount < openCount. These two rules ensure validity." },
        { step: "Backtracking framework", detail: "Build string incrementally. At each position, try '(' and ')' if allowed. When string length reaches 2n, add to result." },
        { step: "Why this generates all valid strings", detail: "We explore all valid choices at each position. The two conditions (open < n, close < open) prune invalid paths early." },
        { step: "No need to 'undo'", detail: "Since we're building strings (immutable in some languages), each recursive call works with its own state. No explicit backtrack step needed for strings." }
    ],
    keyInsight: "Backtrack with two counters: openCount and closeCount. Add '(' if open < n. Add ')' if close < open. When length = 2n, record result. This generates exactly the valid combinations.",
    approach: "Recursive backtracking: track open/close counts. Add '(' or ')' based on validity rules. Collect when string is complete.",
    solutionPython: `def generateParenthesis(n):
    result = []
    
    def backtrack(current, open_count, close_count):
        if len(current) == 2 * n:
            result.append(current)
            return
        if open_count < n:
            backtrack(current + '(', open_count + 1, close_count)
        if close_count < open_count:
            backtrack(current + ')', open_count, close_count + 1)
    
    backtrack('', 0, 0)
    return result`,
    solutionCpp: `vector<string> generateParenthesis(int n) {
    vector<string> result;
    
    function<void(string, int, int)> backtrack = 
        [&](string curr, int open, int close) {
        if (curr.size() == 2 * n) {
            result.push_back(curr);
            return;
        }
        if (open < n) backtrack(curr + '(', open + 1, close);
        if (close < open) backtrack(curr + ')', open, close + 1);
    };
    
    backtrack("", 0, 0);
    return result;
}`,
    timeComplexity: "O(4^n / √n) — nth Catalan number",
    spaceComplexity: "O(n) recursion depth",
    patternGuide: "Use **backtracking with validity constraints** when:\n- Generating all valid combinations\n- Each step has constrained choices\n- Pruning eliminates invalid paths early\n\nSimilar: Letter Combinations, Combination Sum"
},
{
    id: 68,
    lcNumber: 17,
    title: "Letter Combinations of a Phone Number",
    difficulty: "Medium",
    category: "Backtracking",
    description: "Given a string containing digits from 2-9, return all possible letter combinations that the number could represent (like a phone keypad). Return the answer in any order.",
    examples: [
        "Input: digits = \"23\"\nOutput: [\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]",
        "Input: digits = \"\"\nOutput: []"
    ],
    thinkingProcess: [
        { step: "Map digits to letters", detail: "2→abc, 3→def, ..., 9→wxyz. For each digit, we have 3-4 letter choices." },
        { step: "Cartesian product", detail: "We need all combinations of picking one letter from each digit's options. This is a Cartesian product, naturally expressed as backtracking." },
        { step: "Backtracking: one digit at a time", detail: "For digit at index i, try each possible letter. Recurse for index i+1. When i == len(digits), we have a complete combination." },
        { step: "Alternative: iterative BFS", detail: "Start with [''], for each digit, expand each existing string with all possible letters. BFS-like level building." },
        { step: "Complexity", detail: "At most 4 choices per digit, n digits → O(4^n) combinations. Each has length n. Total: O(n × 4^n)." }
    ],
    keyInsight: "Backtracking through digit positions. For each digit, try each mapped letter. Recurse to next digit. Base case: all digits processed = one complete combination.",
    approach: "Phone map + backtracking. For each digit position, iterate its letters, recurse with next position. Collect complete strings.",
    solutionPython: `def letterCombinations(digits):
    if not digits:
        return []
    
    phone = {'2':'abc','3':'def','4':'ghi','5':'jkl',
             '6':'mno','7':'pqrs','8':'tuv','9':'wxyz'}
    result = []
    
    def backtrack(idx, current):
        if idx == len(digits):
            result.append(current)
            return
        for letter in phone[digits[idx]]:
            backtrack(idx + 1, current + letter)
    
    backtrack(0, '')
    return result`,
    solutionCpp: `vector<string> letterCombinations(string digits) {
    if (digits.empty()) return {};
    
    vector<string> phone = {"","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"};
    vector<string> result;
    
    function<void(int, string)> backtrack = [&](int idx, string curr) {
        if (idx == digits.size()) { result.push_back(curr); return; }
        for (char c : phone[digits[idx] - '0'])
            backtrack(idx + 1, curr + c);
    };
    backtrack(0, "");
    return result;
}`,
    timeComplexity: "O(n × 4^n)",
    spaceComplexity: "O(n) recursion depth",
    patternGuide: "Use **backtracking for Cartesian products** when:\n- Multiple positions, each with independent choices\n- Generate all combinations (not permutations)\n- Tree of choices, one level per position\n\nSimilar: Generate Parentheses, Combination Sum"
},
{
    id: 69,
    lcNumber: 51,
    title: "N-Queens",
    difficulty: "Hard",
    category: "Backtracking",
    description: "Place `n` queens on an `n x n` chessboard such that no two queens attack each other. Return all distinct solutions.",
    examples: [
        "Input: n = 4\nOutput: [[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]"
    ],
    thinkingProcess: [
        { step: "Row-by-row placement", detail: "Place one queen per row (since each row must have exactly one queen). For each row, decide which column to place the queen." },
        { step: "Conflict detection", detail: "A queen at (r, c) attacks: same column, same diagonal (r-c constant), same anti-diagonal (r+c constant). Track these with sets." },
        { step: "Backtracking", detail: "For row r, try each column c. If c is not in any conflict set, place the queen, add to conflict sets, recurse to row r+1. Backtrack: remove from sets." },
        { step: "Base case", detail: "When r == n, all queens placed successfully. Record the board configuration." },
        { step: "Three sets suffice", detail: "Track: columns used, diagonals used (r-c), anti-diagonals used (r+c). No need for a full 2D board for conflict checking." }
    ],
    keyInsight: "Place queens row by row. Track conflicts via three sets: columns, diagonals (r-c), anti-diagonals (r+c). Backtrack when column conflicts. N sets give O(1) conflict checking.",
    approach: "Backtrack row by row. For each column: check 3 conflict sets. If safe, place queen, recurse. Undo on backtrack.",
    solutionPython: `def solveNQueens(n):
    result = []
    board = [['.' ] * n for _ in range(n)]
    cols, diags, anti_diags = set(), set(), set()
    
    def backtrack(row):
        if row == n:
            result.append([''.join(r) for r in board])
            return
        for col in range(n):
            if col in cols or (row-col) in diags or (row+col) in anti_diags:
                continue
            cols.add(col)
            diags.add(row - col)
            anti_diags.add(row + col)
            board[row][col] = 'Q'
            
            backtrack(row + 1)
            
            board[row][col] = '.'
            cols.remove(col)
            diags.remove(row - col)
            anti_diags.remove(row + col)
    
    backtrack(0)
    return result`,
    solutionCpp: `vector<vector<string>> solveNQueens(int n) {
    vector<vector<string>> result;
    vector<string> board(n, string(n, '.'));
    unordered_set<int> cols, diags, antiDiags;
    
    function<void(int)> backtrack = [&](int row) {
        if (row == n) { result.push_back(board); return; }
        for (int col = 0; col < n; col++) {
            if (cols.count(col) || diags.count(row-col) || antiDiags.count(row+col))
                continue;
            cols.insert(col); diags.insert(row-col); antiDiags.insert(row+col);
            board[row][col] = 'Q';
            backtrack(row + 1);
            board[row][col] = '.';
            cols.erase(col); diags.erase(row-col); antiDiags.erase(row+col);
        }
    };
    backtrack(0);
    return result;
}`,
    timeComplexity: "O(n!) approximately",
    spaceComplexity: "O(n²) for board",
    patternGuide: "Use **backtracking with constraint sets** when:\n- Placing elements to satisfy multiple constraints\n- Each placement affects future choices\n- Need to generate all valid configurations\n\nSimilar: Sudoku Solver, N-Queens II (counting)"
},
{
    id: 70,
    lcNumber: 79,
    title: "Word Search",
    difficulty: "Medium",
    category: "Backtracking",
    description: "Given an `m x n` board of characters and a string `word`, return `true` if `word` exists in the grid. The word can be constructed from sequentially adjacent cells (horizontal/vertical). Each cell may be used only once.",
    examples: [
        "Input: board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"\nOutput: true",
        "Input: board = same, word = \"SEE\"\nOutput: true"
    ],
    thinkingProcess: [
        { step: "DFS from each cell", detail: "Try starting the word from every cell in the grid. If any starting cell leads to a complete match, return true." },
        { step: "Backtracking DFS", detail: "From cell (r,c), if it matches word[idx], mark as visited, try all 4 neighbors for word[idx+1]. If successful, return true. Otherwise, unmark (backtrack)." },
        { step: "Marking visited", detail: "Instead of a separate visited array, modify the cell temporarily (e.g., set to '#'). Restore after backtracking. Saves space." },
        { step: "Base case", detail: "If idx == len(word), we've matched the entire word → return true." },
        { step: "Pruning", detail: "If cell is out of bounds, already visited, or doesn't match current character → return false immediately. Early termination when first valid path found." }
    ],
    keyInsight: "DFS backtracking from each starting cell. Mark cells as visited during DFS, unmark on backtrack. Match character by character. Return true on first complete match.",
    approach: "For each cell: if matches word[0], DFS with backtracking. Mark visited by modifying cell. Explore 4 directions. Restore cell on backtrack.",
    solutionPython: `def exist(board, word):
    rows, cols = len(board), len(board[0])
    
    def dfs(r, c, idx):
        if idx == len(word):
            return True
        if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != word[idx]:
            return False
        
        temp = board[r][c]
        board[r][c] = '#'  # mark visited
        
        found = (dfs(r+1,c,idx+1) or dfs(r-1,c,idx+1) or
                 dfs(r,c+1,idx+1) or dfs(r,c-1,idx+1))
        
        board[r][c] = temp  # backtrack
        return found
    
    for r in range(rows):
        for c in range(cols):
            if dfs(r, c, 0):
                return True
    return False`,
    solutionCpp: `bool exist(vector<vector<char>>& board, string word) {
    int R = board.size(), C = board[0].size();
    
    function<bool(int,int,int)> dfs = [&](int r, int c, int idx) -> bool {
        if (idx == word.size()) return true;
        if (r<0||r>=R||c<0||c>=C||board[r][c]!=word[idx]) return false;
        
        char temp = board[r][c];
        board[r][c] = '#';
        bool found = dfs(r+1,c,idx+1)||dfs(r-1,c,idx+1)||
                     dfs(r,c+1,idx+1)||dfs(r,c-1,idx+1);
        board[r][c] = temp;
        return found;
    };
    
    for (int r = 0; r < R; r++)
        for (int c = 0; c < C; c++)
            if (dfs(r, c, 0)) return true;
    return false;
}`,
    timeComplexity: "O(m × n × 3^L) where L = word length",
    spaceComplexity: "O(L) recursion depth",
    patternGuide: "Use **grid backtracking with visited** when:\n- Searching for a path/word in a grid\n- Each cell can be used once per path\n- Need to try multiple starting points\n\nSimilar: Word Search II, Longest Increasing Path in Matrix"
},
{
    id: 71,
    lcNumber: 131,
    title: "Palindrome Partitioning",
    difficulty: "Medium",
    category: "Backtracking",
    description: "Given a string `s`, partition `s` such that every substring of the partition is a palindrome. Return all possible palindrome partitionings of `s`.",
    examples: [
        "Input: s = \"aab\"\nOutput: [[\"a\",\"a\",\"b\"],[\"aa\",\"b\"]]",
        "Input: s = \"a\"\nOutput: [[\"a\"]]"
    ],
    thinkingProcess: [
        { step: "Backtracking framework", detail: "At each position, try all possible palindromic substrings starting there. If s[start:end] is a palindrome, add it to the current partition and recurse from end." },
        { step: "Palindrome check", detail: "For each candidate substring, check if it's a palindrome. Can be done inline or precomputed with DP." },
        { step: "Base case", detail: "When start == len(s), we've partitioned the entire string. Add current partition to results." },
        { step: "Precompute palindromes (optimization)", detail: "Use DP: isPalin[i][j] = true if s[i..j] is a palindrome. Precompute in O(n²). Then each check is O(1)." },
        { step: "Pruning", detail: "Only recurse when the chosen substring IS a palindrome. This prunes many invalid paths." }
    ],
    keyInsight: "Backtrack from position 0. At each position, try all substrings starting there. If palindrome, include it and recurse from the end. Base case: reached end of string = valid partition.",
    approach: "Backtracking: at position `start`, try s[start:end] for each end. If palindrome, add to path, recurse from end. Backtrack by removing.",
    solutionPython: `def partition(s):
    result = []
    
    def is_palindrome(sub):
        return sub == sub[::-1]
    
    def backtrack(start, path):
        if start == len(s):
            result.append(path[:])
            return
        
        for end in range(start + 1, len(s) + 1):
            substring = s[start:end]
            if is_palindrome(substring):
                path.append(substring)
                backtrack(end, path)
                path.pop()
    
    backtrack(0, [])
    return result`,
    solutionCpp: `vector<vector<string>> partition(string s) {
    vector<vector<string>> result;
    vector<string> path;
    int n = s.size();
    
    auto isPalin = [&](int i, int j) {
        while (i < j) if (s[i++] != s[j--]) return false;
        return true;
    };
    
    function<void(int)> backtrack = [&](int start) {
        if (start == n) { result.push_back(path); return; }
        for (int end = start; end < n; end++) {
            if (isPalin(start, end)) {
                path.push_back(s.substr(start, end - start + 1));
                backtrack(end + 1);
                path.pop_back();
            }
        }
    };
    backtrack(0);
    return result;
}`,
    timeComplexity: "O(n × 2^n)",
    spaceComplexity: "O(n) recursion depth",
    patternGuide: "Use **partition backtracking** when:\n- Splitting a sequence into valid segments\n- Each segment must satisfy a property\n- Generate all valid partitions\n\nSimilar: Word Break II, Restore IP Addresses"
},
// ============================================================
// CATEGORY: GREEDY (Problems 72-76)
// ============================================================
{
    id: 72,
    lcNumber: 55,
    title: "Jump Game",
    difficulty: "Medium",
    category: "Greedy",
    description: "You are given an integer array `nums`. You are initially at the first index. Each element represents your maximum jump length from that position. Return `true` if you can reach the last index.",
    examples: [
        "Input: nums = [2,3,1,1,4]\nOutput: true\nExplanation: Jump 1 step from 0 to 1, then 3 steps to last index.",
        "Input: nums = [3,2,1,0,4]\nOutput: false"
    ],
    thinkingProcess: [
        { step: "Greedy: track farthest reachable", detail: "As we scan left to right, maintain the farthest index we can reach. If current index > farthest, we're stuck. If farthest ≥ last index, success." },
        { step: "Why greedy works", detail: "At each position, we extend our reach to max(farthest, i + nums[i]). If we can reach position i, all positions up to farthest are also reachable." },
        { step: "Simple one-pass", detail: "For each i from 0 to n-1: if i > farthest, return false (can't reach here). Update farthest = max(farthest, i + nums[i])." },
        { step: "Early termination", detail: "As soon as farthest ≥ n-1, return true." }
    ],
    keyInsight: "Track the farthest reachable index. At each position, extend the reach. If current position is beyond reach, we're stuck. Simple one-pass greedy.",
    approach: "Scan left to right. If i > farthest: false. Update farthest = max(farthest, i+nums[i]). If farthest >= n-1: true.",
    solutionPython: `def canJump(nums):
    farthest = 0
    
    for i in range(len(nums)):
        if i > farthest:
            return False
        farthest = max(farthest, i + nums[i])
        if farthest >= len(nums) - 1:
            return True
    
    return True`,
    solutionCpp: `bool canJump(vector<int>& nums) {
    int farthest = 0;
    for (int i = 0; i < nums.size(); i++) {
        if (i > farthest) return false;
        farthest = max(farthest, i + nums[i]);
        if (farthest >= nums.size() - 1) return true;
    }
    return true;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    patternGuide: "Use **greedy reachability** when:\n- Can you reach a target from a start?\n- Each position extends your range\n- Only need to know IF reachable, not the path\n\nSimilar: Jump Game II, Video Stitching"
},
{
    id: 73,
    lcNumber: 134,
    title: "Gas Station",
    difficulty: "Medium",
    category: "Greedy",
    description: "There are `n` gas stations in a circle. `gas[i]` is the gas at station i, `cost[i]` is the cost to travel from station i to i+1. Starting with an empty tank, find the starting station index to complete the circuit, or return -1.",
    examples: [
        "Input: gas = [1,2,3,4,5], cost = [3,4,5,1,2]\nOutput: 3"
    ],
    thinkingProcess: [
        { step: "Total gas must suffice", detail: "If sum(gas) < sum(cost), it's impossible — return -1. Otherwise, a valid starting point always exists (theorem)." },
        { step: "Key insight: if you fail at j, start after j", detail: "If starting at station i, you run out of gas at station j, then no station between i and j can be a valid start (they'd have even less gas when reaching j). So try starting from j+1." },
        { step: "One-pass greedy", detail: "Track current tank. If it goes negative, reset: start = next station, tank = 0. After one pass, the final start candidate is the answer (if total is sufficient)." },
        { step: "Why one pass works", detail: "We eliminate all stations up to the failure point. The answer must be after the last failure. If total gas ≥ total cost, this remaining candidate is guaranteed to work." }
    ],
    keyInsight: "If total gas ≥ total cost, a solution exists. Greedily find the starting point: if tank goes negative at station j, restart from j+1. The last restart position is the answer.",
    approach: "One pass: track total and current tank. If current < 0, reset start to next station. If total >= 0, return start; else -1.",
    solutionPython: `def canCompleteCircuit(gas, cost):
    if sum(gas) < sum(cost):
        return -1
    
    start = 0
    tank = 0
    
    for i in range(len(gas)):
        tank += gas[i] - cost[i]
        if tank < 0:
            start = i + 1
            tank = 0
    
    return start`,
    solutionCpp: `int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
    int total = 0, tank = 0, start = 0;
    for (int i = 0; i < gas.size(); i++) {
        total += gas[i] - cost[i];
        tank += gas[i] - cost[i];
        if (tank < 0) {
            start = i + 1;
            tank = 0;
        }
    }
    return total >= 0 ? start : -1;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    patternGuide: "Use **greedy reset** when:\n- Circular traversal with resource tracking\n- Failure at a point eliminates all prior starts\n- Total feasibility check + local reset\n\nSimilar: Candy, Queue Reconstruction by Height"
},
{
    id: 74,
    lcNumber: 763,
    title: "Partition Labels",
    difficulty: "Medium",
    category: "Greedy",
    description: "Given a string `s`, partition it into as many parts as possible so that each letter appears in at most one part. Return the sizes of the parts.",
    examples: [
        "Input: s = \"ababcbacadefegdehijhklij\"\nOutput: [9,7,8]"
    ],
    thinkingProcess: [
        { step: "Last occurrence insight", detail: "For a character at position i, the partition containing it must extend at least to its last occurrence in the string." },
        { step: "Greedy extension", detail: "Precompute last occurrence of each character. Scan left to right, tracking the farthest last-occurrence seen. When current index equals this farthest point, we've found a partition boundary." },
        { step: "Why this works", detail: "At the boundary point, all characters in this partition have their last occurrence ≤ boundary. So they won't appear in later partitions. This gives us the smallest valid first partition." },
        { step: "Implementation", detail: "Build lastOccurrence map. Scan with `start` and `end` pointers. end = max(end, lastOccurrence[s[i]]). When i == end, record partition size, update start." }
    ],
    keyInsight: "Precompute each character's last occurrence. Scan left to right, expanding the partition end to include each character's last occurrence. When i == end, partition is complete.",
    approach: "Map last occurrences. Scan: extend end = max(end, last[char]). When i == end: partition found, record size end-start+1, set start = i+1.",
    solutionPython: `def partitionLabels(s):
    last = {c: i for i, c in enumerate(s)}
    result = []
    start = end = 0
    
    for i, c in enumerate(s):
        end = max(end, last[c])
        if i == end:
            result.append(end - start + 1)
            start = i + 1
    
    return result`,
    solutionCpp: `vector<int> partitionLabels(string s) {
    vector<int> last(26, 0);
    for (int i = 0; i < s.size(); i++)
        last[s[i]-'a'] = i;
    
    vector<int> result;
    int start = 0, end = 0;
    for (int i = 0; i < s.size(); i++) {
        end = max(end, last[s[i]-'a']);
        if (i == end) {
            result.push_back(end - start + 1);
            start = i + 1;
        }
    }
    return result;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1) — 26-char map",
    patternGuide: "Use **greedy interval extension** when:\n- Partitioning by element constraints\n- Each element forces a minimum partition range\n- Extend partition boundary greedily\n\nSimilar: Merge Intervals, Task Scheduler"
},
{
    id: 75,
    lcNumber: 846,
    title: "Hand of Straights",
    difficulty: "Medium",
    category: "Greedy",
    description: "Alice has `hand` of cards and wants to rearrange them into groups of `groupSize` consecutive cards. Return `true` if possible.",
    examples: [
        "Input: hand = [1,2,3,6,2,3,4,7,8], groupSize = 3\nOutput: true\nExplanation: [1,2,3], [2,3,4], [6,7,8]",
        "Input: hand = [1,2,3,4,5], groupSize = 4\nOutput: false"
    ],
    thinkingProcess: [
        { step: "Quick check", detail: "If len(hand) % groupSize != 0, impossible." },
        { step: "Greedy: always start with smallest", detail: "Count frequencies. Sort unique values. For the smallest available card, try to form a group of consecutive cards starting from it." },
        { step: "Building groups", detail: "For the current minimum card `c`, need c, c+1, ..., c+groupSize-1. Decrement each count. If any count goes negative, impossible." },
        { step: "Repeat", detail: "Keep forming groups starting from the current smallest card until all cards are used." },
        { step: "Use a sorted map or heap", detail: "TreeMap (sorted) or sort + hash map. Process cards from smallest to largest." }
    ],
    keyInsight: "Greedy: always form groups starting from the smallest available card. Count frequencies, sort, and for each minimum card, build a consecutive group. If any card is missing, return false.",
    approach: "Count frequencies. Sort unique cards. For each smallest card, try to form a group of groupSize consecutive cards. Decrement counts.",
    solutionPython: `from collections import Counter

def isNStraightHand(hand, groupSize):
    if len(hand) % groupSize != 0:
        return False
    
    count = Counter(hand)
    
    for card in sorted(count):
        while count[card] > 0:
            for i in range(groupSize):
                if count[card + i] <= 0:
                    return False
                count[card + i] -= 1
    
    return True`,
    solutionCpp: `bool isNStraightHand(vector<int>& hand, int groupSize) {
    if (hand.size() % groupSize != 0) return false;
    
    map<int,int> count;
    for (int c : hand) count[c]++;
    
    for (auto& [card, cnt] : count) {
        while (cnt > 0) {
            for (int i = 0; i < groupSize; i++) {
                if (count[card + i] <= 0) return false;
                count[card + i]--;
            }
        }
    }
    return true;
}`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    patternGuide: "Use **greedy consecutive grouping** when:\n- Forming groups of consecutive elements\n- Always start with the smallest available\n- Count-based processing\n\nSimilar: Divide Array in Sets of K Consecutive, Task Scheduler"
},
{
    id: 76,
    lcNumber: 1029,
    title: "Two City Scheduling",
    difficulty: "Medium",
    category: "Greedy",
    description: "A company plans to interview `2n` people. `costs[i] = [aCost, bCost]` where aCost is the cost of flying person i to city A and bCost to city B. Return the minimum cost to fly exactly `n` people to each city.",
    examples: [
        "Input: costs = [[10,20],[30,200],[400,50],[30,20]]\nOutput: 110\nExplanation: Person 0→A(10), 1→A(30), 2→B(50), 3→B(20). Total=110."
    ],
    thinkingProcess: [
        { step: "Everyone goes to city A first", detail: "Imagine sending everyone to A. Cost = sum of all aCost. Now we need to switch n people to B." },
        { step: "Cost of switching", detail: "Switching person i from A to B saves: aCost[i] - bCost[i]. If positive, we save money. If negative, we pay more." },
        { step: "Greedy: switch the n cheapest", detail: "Sort by (aCost - bCost). The first n people have the largest savings from going to A → send to A. The last n people have the largest savings from going to B → send to B." },
        { step: "Equivalently", detail: "Sort by (aCost - bCost). First n → A, last n → B. Or sort by (bCost - aCost) and reverse." },
        { step: "Alternative: sort by difference", detail: "Sort people by how much cheaper city A is compared to city B. The first n go to A (A is relatively cheapest for them). Rest go to B." }
    ],
    keyInsight: "Sort by (costA - costB). Send the first n (where A is relatively cheapest) to city A. Send the rest to city B. Greedy works because sorting by the 'opportunity cost' gives optimal assignment.",
    approach: "Sort costs by (aCost - bCost). First n people → city A (cheapest relative to A). Last n → city B.",
    solutionPython: `def twoCitySchedCost(costs):
    # Sort by advantage of city A over city B
    costs.sort(key=lambda x: x[0] - x[1])
    
    n = len(costs) // 2
    total = 0
    for i in range(n):
        total += costs[i][0]       # first n → city A
    for i in range(n, 2 * n):
        total += costs[i][1]       # last n → city B
    
    return total`,
    solutionCpp: `int twoCitySchedCost(vector<vector<int>>& costs) {
    sort(costs.begin(), costs.end(), [](auto& a, auto& b) {
        return (a[0]-a[1]) < (b[0]-b[1]);
    });
    
    int n = costs.size() / 2, total = 0;
    for (int i = 0; i < n; i++) total += costs[i][0];
    for (int i = n; i < 2*n; i++) total += costs[i][1];
    return total;
}`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    patternGuide: "Use **sort by opportunity cost** when:\n- Assigning items to two categories\n- Each item has different costs per category\n- Need to balance exactly n in each\n\nSimilar: Assign Cookies, Boats to Save People"
},
// ============================================================
// CATEGORY: INTERVALS (Problems 77-80)
// ============================================================
{
    id: 77,
    lcNumber: 56,
    title: "Merge Intervals",
    difficulty: "Medium",
    category: "Intervals",
    description: "Given an array of `intervals` where `intervals[i] = [start, end]`, merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    examples: [
        "Input: intervals = [[1,3],[2,6],[8,10],[15,18]]\nOutput: [[1,6],[8,10],[15,18]]",
        "Input: intervals = [[1,4],[4,5]]\nOutput: [[1,5]]"
    ],
    thinkingProcess: [
        { step: "Sort by start time", detail: "Sort intervals by start time. Now overlapping intervals are adjacent." },
        { step: "Merge logic", detail: "Walk through sorted intervals. If current overlaps with the last merged interval (current.start <= last.end), extend: last.end = max(last.end, current.end). Otherwise, start a new interval." },
        { step: "Why sorting helps", detail: "After sorting, if interval B doesn't overlap with A (B.start > A.end), no later interval can overlap with A either (all have start ≥ B.start). So we only compare adjacent." },
        { step: "Edge cases", detail: "Touching intervals [1,4],[4,5] → merge. Single interval → return as-is." }
    ],
    keyInsight: "Sort by start time. Walk through: if current overlaps last merged (start ≤ last.end), extend the end. Otherwise, push a new interval. Sorting makes adjacent comparison sufficient.",
    approach: "Sort by start. Initialize result with first interval. For each next: if overlapping, extend end. Else, append new interval.",
    solutionPython: `def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    
    return merged`,
    solutionCpp: `vector<vector<int>> merge(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> merged = {intervals[0]};
    
    for (int i = 1; i < intervals.size(); i++) {
        if (intervals[i][0] <= merged.back()[1])
            merged.back()[1] = max(merged.back()[1], intervals[i][1]);
        else
            merged.push_back(intervals[i]);
    }
    return merged;
}`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    patternGuide: "Use **sort + merge** when:\n- Merging overlapping intervals\n- Consolidating time ranges\n- Any problem with overlapping segments\n\nSimilar: Insert Interval, Non-overlapping Intervals, Meeting Rooms"
},
{
    id: 78,
    lcNumber: 435,
    title: "Non-overlapping Intervals",
    difficulty: "Medium",
    category: "Intervals",
    description: "Given an array of intervals, return the minimum number of intervals to remove to make the rest non-overlapping.",
    examples: [
        "Input: intervals = [[1,2],[2,3],[3,4],[1,3]]\nOutput: 1\nExplanation: Remove [1,3] to make rest non-overlapping.",
        "Input: intervals = [[1,2],[1,2],[1,2]]\nOutput: 2"
    ],
    thinkingProcess: [
        { step: "Reframe: maximize kept intervals", detail: "Minimum removed = total - maximum non-overlapping intervals kept. So find the maximum set of non-overlapping intervals (activity selection)." },
        { step: "Sort by end time", detail: "Greedy: sort by end time. Pick the interval that ends earliest (leaves most room). Skip intervals that overlap with the last picked." },
        { step: "Why sort by end time?", detail: "Picking the earliest-ending interval is always optimal — it frees up the most space for future intervals. This is the classic activity selection proof." },
        { step: "Count kept intervals", detail: "Initialize with first interval. For each next: if start ≥ last.end, keep it (non-overlapping). Otherwise, skip." },
        { step: "Answer", detail: "Removed = total - kept." }
    ],
    keyInsight: "Classic activity selection: sort by end time, greedily pick earliest-ending non-overlapping intervals. Answer = total - number kept. Equivalent to minimum removal.",
    approach: "Sort by end time. Greedy: keep interval if start ≥ last end. Count kept. Answer = n - kept.",
    solutionPython: `def eraseOverlapIntervals(intervals):
    intervals.sort(key=lambda x: x[1])
    kept = 1
    last_end = intervals[0][1]
    
    for start, end in intervals[1:]:
        if start >= last_end:
            kept += 1
            last_end = end
    
    return len(intervals) - kept`,
    solutionCpp: `int eraseOverlapIntervals(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end(), 
         [](auto& a, auto& b) { return a[1] < b[1]; });
    
    int kept = 1, lastEnd = intervals[0][1];
    for (int i = 1; i < intervals.size(); i++) {
        if (intervals[i][0] >= lastEnd) {
            kept++;
            lastEnd = intervals[i][1];
        }
    }
    return intervals.size() - kept;
}`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    patternGuide: "Use **greedy activity selection (sort by end)** when:\n- Maximizing non-overlapping intervals\n- Minimum removal for non-overlap\n- Scheduling without conflicts\n\nSimilar: Meeting Rooms, Minimum Number of Arrows"
},
{
    id: 79,
    lcNumber: 253,
    title: "Meeting Rooms II",
    difficulty: "Medium",
    category: "Intervals",
    description: "Given an array of meeting time intervals `[start, end]`, find the minimum number of conference rooms required.",
    examples: [
        "Input: intervals = [[0,30],[5,10],[15,20]]\nOutput: 2\nExplanation: [0,30] uses one room. [5,10] overlaps, needs second room. [15,20] can reuse second room.",
        "Input: intervals = [[7,10],[2,4]]\nOutput: 1"
    ],
    thinkingProcess: [
        { step: "Track concurrent meetings", detail: "The minimum rooms needed = maximum number of meetings happening simultaneously at any point in time." },
        { step: "Sweep line approach", detail: "Create events: +1 at each start, -1 at each end. Sort events. Sweep through, tracking running count. Maximum count = answer." },
        { step: "Alternative: min-heap", detail: "Sort by start time. Use a min-heap of end times. For each meeting: if heap.top ≤ current.start, pop (reuse room). Push current.end. Heap size = rooms needed." },
        { step: "Why heap works", detail: "The heap tracks the earliest-ending ongoing meeting. If it ends before the new one starts, we reuse that room. Otherwise, we need a new room." },
        { step: "Sweep line detail", detail: "Events: (time, +1 for start, -1 for end). Sort by time (break ties: end before start, so ending frees room before new one needs it). Running sum's max = answer." }
    ],
    keyInsight: "Sweep line: events at starts (+1) and ends (-1). Sort and scan — the peak concurrent count = minimum rooms. Or: min-heap of end times, size = rooms.",
    approach: "Separate starts and ends. Sort both. Two pointers: advance start pointer (need room), advance end pointer when end ≤ start (free room). Max concurrent = answer.",
    solutionPython: `def minMeetingRooms(intervals):
    starts = sorted(i[0] for i in intervals)
    ends = sorted(i[1] for i in intervals)
    
    rooms = 0
    max_rooms = 0
    s = e = 0
    
    while s < len(starts):
        if starts[s] < ends[e]:
            rooms += 1
            max_rooms = max(max_rooms, rooms)
            s += 1
        else:
            rooms -= 1
            e += 1
    
    return max_rooms`,
    solutionCpp: `int minMeetingRooms(vector<vector<int>>& intervals) {
    vector<int> starts, ends;
    for (auto& i : intervals) {
        starts.push_back(i[0]);
        ends.push_back(i[1]);
    }
    sort(starts.begin(), starts.end());
    sort(ends.begin(), ends.end());
    
    int rooms = 0, maxRooms = 0, e = 0;
    for (int s = 0; s < starts.size(); s++) {
        if (starts[s] < ends[e])
            rooms++;
        else {
            rooms--; e++;  // the else shouldn't decrement, just advance e
            rooms++; // still add room for current meeting
        }
        // Simpler: just track with two pointers
    }
    // Cleaner version:
    rooms = 0; maxRooms = 0; e = 0;
    for (int s = 0; s < starts.size(); s++) {
        while (e < ends.size() && ends[e] <= starts[s]) { rooms--; e++; }
        rooms++;
        maxRooms = max(maxRooms, rooms);
    }
    return maxRooms;
}`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    patternGuide: "Use **sweep line / two sorted arrays** when:\n- Finding max concurrent events\n- Resource allocation (rooms, CPUs, etc.)\n- Peak overlap detection\n\nSimilar: Car Pooling, My Calendar II, Employee Free Time"
},
{
    id: 80,
    lcNumber: 986,
    title: "Interval List Intersections",
    difficulty: "Medium",
    category: "Intervals",
    description: "You are given two lists of closed intervals, each sorted and disjoint. Return the intersection of these two interval lists.",
    examples: [
        "Input: firstList = [[0,2],[5,10],[13,23],[24,25]], secondList = [[1,5],[8,12],[15,24],[25,26]]\nOutput: [[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]"
    ],
    thinkingProcess: [
        { step: "Two pointer approach", detail: "Both lists are sorted. Use two pointers, one for each list. At each step, compute the intersection of the current intervals from both lists." },
        { step: "Intersection of two intervals", detail: "[a1,a2] and [b1,b2] intersect if max(a1,b1) ≤ min(a2,b2). The intersection is [max(a1,b1), min(a2,b2)]." },
        { step: "Which pointer to advance?", detail: "After checking intersection, advance the pointer whose interval ends first. That interval can't intersect with anything else in the other list." },
        { step: "Why advance the earlier-ending one?", detail: "The earlier-ending interval is 'done' — it can't overlap with any future interval in the other list (since both lists are sorted). The later-ending one might still overlap with the next interval." }
    ],
    keyInsight: "Two pointers on sorted interval lists. Intersection = [max(starts), min(ends)] when max(starts) ≤ min(ends). Advance the pointer with the earlier end time.",
    approach: "Two pointers i, j. Compute intersection. If valid, add. Advance pointer with smaller end.",
    solutionPython: `def intervalIntersection(firstList, secondList):
    result = []
    i = j = 0
    
    while i < len(firstList) and j < len(secondList):
        lo = max(firstList[i][0], secondList[j][0])
        hi = min(firstList[i][1], secondList[j][1])
        
        if lo <= hi:
            result.append([lo, hi])
        
        # Advance the one that ends first
        if firstList[i][1] < secondList[j][1]:
            i += 1
        else:
            j += 1
    
    return result`,
    solutionCpp: `vector<vector<int>> intervalIntersection(vector<vector<int>>& A, vector<vector<int>>& B) {
    vector<vector<int>> result;
    int i = 0, j = 0;
    
    while (i < A.size() && j < B.size()) {
        int lo = max(A[i][0], B[j][0]);
        int hi = min(A[i][1], B[j][1]);
        if (lo <= hi) result.push_back({lo, hi});
        if (A[i][1] < B[j][1]) i++;
        else j++;
    }
    return result;
}`,
    timeComplexity: "O(m + n)",
    spaceComplexity: "O(1) excluding output",
    patternGuide: "Use **two-pointer interval intersection** when:\n- Finding overlaps between two sorted interval lists\n- Merging/intersecting sorted event streams\n- Calendar intersection problems\n\nSimilar: Merge Intervals, Employee Free Time"
},
// ============================================================
// CATEGORY: TRIE (Problems 81-83)
// ============================================================
{
    id: 81,
    lcNumber: 208,
    title: "Implement Trie (Prefix Tree)",
    difficulty: "Medium",
    category: "Trie",
    description: "Implement a trie with `insert`, `search`, and `startsWith` methods.",
    examples: [
        "Input: [\"Trie\",\"insert\",\"search\",\"search\",\"startsWith\",\"insert\",\"search\"]\n[[],[\"apple\"],[\"apple\"],[\"app\"],[\"app\"],[\"app\"],[\"app\"]]\nOutput: [null,null,true,false,true,null,true]"
    ],
    thinkingProcess: [
        { step: "What is a Trie?", detail: "A tree where each node represents a character. Paths from root to marked nodes spell out stored words. Each node has up to 26 children (for a-z)." },
        { step: "Node structure", detail: "Each node has: children (dict or array of 26), and isEnd (boolean marking if a word ends here)." },
        { step: "Insert", detail: "For each character in the word, follow/create the child node. Mark the last node as isEnd = true." },
        { step: "Search", detail: "For each character, follow child nodes. If any character doesn't have a child, return false. If we reach the end, check isEnd." },
        { step: "StartsWith", detail: "Same as search but don't check isEnd at the end — we just need the prefix to exist." }
    ],
    keyInsight: "Trie nodes have children (one per character) and an isEnd flag. Insert: create path. Search: follow path + check isEnd. StartsWith: follow path only.",
    approach: "TrieNode with children dict and isEnd. Insert: traverse/create nodes. Search: traverse, check isEnd. StartsWith: traverse only.",
    solutionPython: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
    
    def search(self, word):
        node = self._find(word)
        return node is not None and node.is_end
    
    def startsWith(self, prefix):
        return self._find(prefix) is not None
    
    def _find(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return None
            node = node.children[char]
        return node`,
    solutionCpp: `class Trie {
    struct TrieNode {
        TrieNode* children[26] = {};
        bool isEnd = false;
    };
    TrieNode* root;
    
public:
    Trie() : root(new TrieNode()) {}
    
    void insert(string word) {
        TrieNode* node = root;
        for (char c : word) {
            if (!node->children[c-'a'])
                node->children[c-'a'] = new TrieNode();
            node = node->children[c-'a'];
        }
        node->isEnd = true;
    }
    
    bool search(string word) {
        TrieNode* node = find(word);
        return node && node->isEnd;
    }
    
    bool startsWith(string prefix) {
        return find(prefix) != nullptr;
    }
    
private:
    TrieNode* find(string& s) {
        TrieNode* node = root;
        for (char c : s) {
            if (!node->children[c-'a']) return nullptr;
            node = node->children[c-'a'];
        }
        return node;
    }
};`,
    timeComplexity: "O(m) per operation, m = word length",
    spaceComplexity: "O(total characters inserted)",
    patternGuide: "Use **Trie** when:\n- Prefix-based searches\n- Autocomplete systems\n- Word validation/dictionary\n- Efficient string storage with shared prefixes\n\nSimilar: Word Search II, Design Add and Search Words, Replace Words"
},
{
    id: 82,
    lcNumber: 212,
    title: "Word Search II",
    difficulty: "Hard",
    category: "Trie",
    description: "Given an `m x n` board of characters and a list of strings `words`, return all words that can be found in the board. Each word must be constructed from sequentially adjacent cells, each used at most once per word.",
    examples: [
        "Input: board = [[\"o\",\"a\",\"a\",\"n\"],[\"e\",\"t\",\"a\",\"e\"],[\"i\",\"h\",\"k\",\"r\"],[\"i\",\"f\",\"l\",\"v\"]], words = [\"oath\",\"pea\",\"eat\",\"rain\"]\nOutput: [\"eat\",\"oath\"]"
    ],
    thinkingProcess: [
        { step: "Naive: Word Search × number of words", detail: "For each word, run Word Search (DFS) on the board. This is O(words × m × n × 4^L). Too slow for many words." },
        { step: "Trie optimization", detail: "Build a Trie from all words. DFS on the board, following Trie nodes. This searches for ALL words simultaneously in a single board traversal." },
        { step: "DFS + Trie traversal", detail: "From each cell, DFS while following Trie. If Trie node has isEnd = true, we found a word. If Trie node has no matching child, prune (backtrack)." },
        { step: "Optimization: remove found words", detail: "After finding a word, remove it from the Trie (mark isEnd false). This prevents duplicates and prunes the search space." },
        { step: "Backtracking", detail: "Mark cells visited during DFS (change to '#'). Restore after backtracking. Same as Word Search I but driven by Trie." }
    ],
    keyInsight: "Build Trie from words. DFS on board following Trie paths simultaneously searches all words. Trie prunes invalid paths immediately. Much faster than individual word searches.",
    approach: "Build Trie. DFS from each cell, following Trie. When isEnd hit, record word. Backtrack as in Word Search. Remove found words from Trie.",
    solutionPython: `def findWords(board, words):
    # Build Trie
    root = {}
    for word in words:
        node = root
        for c in word:
            node = node.setdefault(c, {})
        node['#'] = word  # mark end with the word itself
    
    R, C = len(board), len(board[0])
    result = []
    
    def dfs(r, c, node):
        if r<0 or r>=R or c<0 or c>=C:
            return
        char = board[r][c]
        if char not in node:
            return
        
        next_node = node[char]
        if '#' in next_node:
            result.append(next_node['#'])
            del next_node['#']  # avoid duplicates
        
        board[r][c] = '.'  # mark visited
        dfs(r+1,c,next_node)
        dfs(r-1,c,next_node)
        dfs(r,c+1,next_node)
        dfs(r,c-1,next_node)
        board[r][c] = char  # restore
        
        # Prune empty Trie branches
        if not next_node:
            del node[char]
    
    for r in range(R):
        for c in range(C):
            dfs(r, c, root)
    
    return result`,
    solutionCpp: `class Solution {
    struct TrieNode {
        TrieNode* ch[26] = {};
        string word = "";
    };
    
public:
    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
        TrieNode* root = new TrieNode();
        for (auto& w : words) {
            TrieNode* node = root;
            for (char c : w) {
                if (!node->ch[c-'a']) node->ch[c-'a'] = new TrieNode();
                node = node->ch[c-'a'];
            }
            node->word = w;
        }
        
        vector<string> result;
        int R = board.size(), C = board[0].size();
        
        function<void(int,int,TrieNode*)> dfs = [&](int r, int c, TrieNode* node) {
            if (r<0||r>=R||c<0||c>=C||board[r][c]=='.'||!node->ch[board[r][c]-'a'])
                return;
            char ch = board[r][c];
            TrieNode* next = node->ch[ch-'a'];
            if (!next->word.empty()) {
                result.push_back(next->word);
                next->word = "";
            }
            board[r][c] = '.';
            dfs(r+1,c,next); dfs(r-1,c,next); dfs(r,c+1,next); dfs(r,c-1,next);
            board[r][c] = ch;
        };
        
        for (int r = 0; r < R; r++)
            for (int c = 0; c < C; c++)
                dfs(r, c, root);
        return result;
    }
};`,
    timeComplexity: "O(m × n × 4^L) worst case, much better in practice",
    spaceComplexity: "O(total characters in words)",
    patternGuide: "Use **Trie + grid DFS** when:\n- Searching for multiple words in a grid simultaneously\n- Trie prunes search paths that don't lead to any word\n- Massive speedup over individual word searches\n\nSimilar: Word Search, Boggle"
},
{
    id: 83,
    lcNumber: 211,
    title: "Design Add and Search Words Data Structure",
    difficulty: "Medium",
    category: "Trie",
    description: "Design a data structure that supports adding new words and searching. Search can contain `.` which matches any letter.",
    examples: [
        "addWord(\"bad\"), addWord(\"dad\"), addWord(\"mad\"), search(\"pad\")→false, search(\"bad\")→true, search(\".ad\")→true, search(\"b..\")→true"
    ],
    thinkingProcess: [
        { step: "Standard Trie for addWord", detail: "Insert words into a Trie normally, character by character." },
        { step: "Search with '.' wildcard", detail: "When search encounters a '.', it must try ALL children of the current node (since '.' matches any character). This requires DFS/backtracking." },
        { step: "Recursive search", detail: "For each character: if it's a letter, follow that child. If it's '.', try all 26 possible children recursively. Return true if any path succeeds." },
        { step: "Base case", detail: "When we've consumed all characters in the search word, check if the current node is marked as end-of-word." },
        { step: "Worst case", detail: "A search like '...' requires exploring many branches. But in practice, the Trie structure limits the search significantly." }
    ],
    keyInsight: "Trie for storage. On search, '.' branches into all children (DFS). Regular characters follow the specific child. Combines Trie structure with backtracking for wildcards.",
    approach: "Trie insert as normal. Search: recursive DFS. For '.': try all children. For letter: follow specific child. Check isEnd at word's end.",
    solutionPython: `class WordDictionary:
    def __init__(self):
        self.root = {}
    
    def addWord(self, word):
        node = self.root
        for c in word:
            node = node.setdefault(c, {})
        node['$'] = True
    
    def search(self, word):
        def dfs(node, i):
            if i == len(word):
                return '$' in node
            if word[i] == '.':
                return any(dfs(child, i+1) 
                          for key, child in node.items() 
                          if key != '$')
            if word[i] not in node:
                return False
            return dfs(node[word[i]], i+1)
        
        return dfs(self.root, 0)`,
    solutionCpp: `class WordDictionary {
    struct Node {
        Node* ch[26] = {};
        bool isEnd = false;
    };
    Node* root;
    
    bool dfs(Node* node, string& word, int i) {
        if (i == word.size()) return node->isEnd;
        if (word[i] == '.') {
            for (int c = 0; c < 26; c++)
                if (node->ch[c] && dfs(node->ch[c], word, i+1))
                    return true;
            return false;
        }
        if (!node->ch[word[i]-'a']) return false;
        return dfs(node->ch[word[i]-'a'], word, i+1);
    }
    
public:
    WordDictionary() : root(new Node()) {}
    
    void addWord(string word) {
        Node* node = root;
        for (char c : word) {
            if (!node->ch[c-'a']) node->ch[c-'a'] = new Node();
            node = node->ch[c-'a'];
        }
        node->isEnd = true;
    }
    
    bool search(string word) { return dfs(root, word, 0); }
};`,
    timeComplexity: "O(m) add, O(26^m) worst search with all dots",
    spaceComplexity: "O(total characters)",
    patternGuide: "Use **Trie + DFS for wildcard search** when:\n- Dictionary with wildcard queries\n- '.' matches any character → branch to all children\n- Combines Trie structure with backtracking\n\nSimilar: Implement Trie, Word Search II"
},
// ============================================================
// CATEGORY: STRING (Problems 84-88)
// ============================================================
{
    id: 84,
    lcNumber: 5,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    category: "String",
    description: "Given a string `s`, return the longest palindromic substring in `s`.",
    examples: [
        "Input: s = \"babad\"\nOutput: \"bab\" (or \"aba\")",
        "Input: s = \"cbbd\"\nOutput: \"bb\""
    ],
    thinkingProcess: [
        { step: "Expand around center", detail: "A palindrome mirrors around its center. For each character (and gap between chars), expand outward while characters match. This finds the longest palindrome centered there." },
        { step: "Two types of centers", detail: "Odd-length palindromes center on a character (n centers). Even-length palindromes center between two characters (n-1 centers). Check both." },
        { step: "Expansion", detail: "For center at position (left, right): while s[left]==s[right], expand. Track the longest found." },
        { step: "Why this is O(n²)", detail: "n centers, each expansion is O(n) worst case. Total O(n²). There's an O(n) Manacher's algorithm, but expand-from-center is simpler and usually sufficient." },
        { step: "Track with start and length", detail: "Instead of storing substrings, track the start index and max length of the best palindrome found." }
    ],
    keyInsight: "Expand around each center (both character centers and gap centers). For each, expand while characters match. Track the longest palindrome. O(n²) time, O(1) space.",
    approach: "For each center (2n-1 total): expand while matching. Track longest. Return the best substring.",
    solutionPython: `def longestPalindrome(s):
    start, max_len = 0, 1
    
    def expand(left, right):
        nonlocal start, max_len
        while left >= 0 and right < len(s) and s[left] == s[right]:
            if right - left + 1 > max_len:
                start = left
                max_len = right - left + 1
            left -= 1
            right += 1
    
    for i in range(len(s)):
        expand(i, i)      # odd length
        expand(i, i + 1)  # even length
    
    return s[start:start + max_len]`,
    solutionCpp: `string longestPalindrome(string s) {
    int start = 0, maxLen = 1, n = s.size();
    
    auto expand = [&](int l, int r) {
        while (l >= 0 && r < n && s[l] == s[r]) {
            if (r - l + 1 > maxLen) {
                start = l;
                maxLen = r - l + 1;
            }
            l--; r++;
        }
    };
    
    for (int i = 0; i < n; i++) {
        expand(i, i);     // odd
        expand(i, i + 1); // even
    }
    return s.substr(start, maxLen);
}`,
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    patternGuide: "Use **expand around center** when:\n- Finding palindromic substrings\n- Need all palindromes or the longest one\n- Simpler than DP for substring palindromes\n\nSimilar: Palindromic Substrings, Shortest Palindrome"
},
{
    id: 85,
    lcNumber: 49,
    title: "Group Anagrams",
    difficulty: "Medium",
    category: "String",
    description: "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.",
    examples: [
        "Input: strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]\nOutput: [[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]"
    ],
    thinkingProcess: [
        { step: "What defines an anagram group?", detail: "Anagrams have the same characters in the same frequencies. We need a canonical form (key) that's identical for all anagrams." },
        { step: "Key option 1: sorted string", detail: "Sort each string. All anagrams produce the same sorted string. Use as hash key. O(k log k) per string." },
        { step: "Key option 2: character count", detail: "Count frequency of each character. Use the count tuple as key. O(k) per string, O(26) = O(1) extra." },
        { step: "Group by key", detail: "Use a hash map: key → list of strings. Iterate all strings, compute key, add to map." },
        { step: "Return values", detail: "Return all values of the hash map." }
    ],
    keyInsight: "Use sorted string (or char frequency tuple) as a canonical key for each anagram group. Hash map groups all strings sharing the same key.",
    approach: "For each string, compute canonical key (sorted or char count). Group in hash map by key. Return all groups.",
    solutionPython: `from collections import defaultdict

def groupAnagrams(strs):
    groups = defaultdict(list)
    
    for s in strs:
        key = tuple(sorted(s))  # or use char count tuple
        groups[key].append(s)
    
    return list(groups.values())`,
    solutionCpp: `vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string, vector<string>> groups;
    
    for (auto& s : strs) {
        string key = s;
        sort(key.begin(), key.end());
        groups[key].push_back(s);
    }
    
    vector<vector<string>> result;
    for (auto& [k, v] : groups)
        result.push_back(v);
    return result;
}`,
    timeComplexity: "O(n × k log k) where k = max string length",
    spaceComplexity: "O(n × k)",
    patternGuide: "Use **canonical form hashing** when:\n- Grouping equivalent items\n- Anagram detection/grouping\n- Any equivalence class grouping\n\nSimilar: Valid Anagram, Find All Anagrams in String"
},
{
    id: 86,
    lcNumber: 271,
    title: "Encode and Decode Strings",
    difficulty: "Medium",
    category: "String",
    description: "Design an algorithm to encode a list of strings into a single string and decode it back. The encoded string is transmitted over a network.",
    examples: [
        "Input: [\"Hello\",\"World\"]\nEncoded: \"5#Hello5#World\"\nDecoded: [\"Hello\",\"World\"]"
    ],
    thinkingProcess: [
        { step: "Challenge", detail: "Strings can contain ANY character (including delimiters). We can't just join with a comma or newline." },
        { step: "Length-prefix encoding", detail: "For each string, encode its length followed by a delimiter, then the string itself. E.g., \"Hello\" → \"5#Hello\"." },
        { step: "Why this works", detail: "The length tells us exactly how many characters to read. No ambiguity, even if the string contains '#' or digits." },
        { step: "Decoding", detail: "Read digits until '#'. Parse the number. Read that many characters. Repeat." },
        { step: "Edge cases", detail: "Empty strings: \"0#\". Empty list: \"\". Strings with special characters: handled by length prefix." }
    ],
    keyInsight: "Length-prefix each string: `len + '#' + string`. Decode by reading length, then extracting exactly that many characters. Handles any character in strings.",
    approach: "Encode: for each string, prepend 'length#'. Decode: parse length before '#', read that many chars, repeat.",
    solutionPython: `class Codec:
    def encode(self, strs):
        return ''.join(f'{len(s)}#{s}' for s in strs)
    
    def decode(self, s):
        result = []
        i = 0
        while i < len(s):
            j = s.index('#', i)
            length = int(s[i:j])
            result.append(s[j+1:j+1+length])
            i = j + 1 + length
        return result`,
    solutionCpp: `class Codec {
public:
    string encode(vector<string>& strs) {
        string encoded;
        for (auto& s : strs)
            encoded += to_string(s.size()) + "#" + s;
        return encoded;
    }
    
    vector<string> decode(string s) {
        vector<string> result;
        int i = 0;
        while (i < s.size()) {
            int j = s.find('#', i);
            int len = stoi(s.substr(i, j - i));
            result.push_back(s.substr(j + 1, len));
            i = j + 1 + len;
        }
        return result;
    }
};`,
    timeComplexity: "O(n) where n = total characters",
    spaceComplexity: "O(n)",
    patternGuide: "Use **length-prefix encoding** when:\n- Serializing lists of strings\n- Strings can contain any character\n- Need unambiguous encoding/decoding\n\nSimilar: Serialize/Deserialize Binary Tree, Codec problems"
},
{
    id: 87,
    lcNumber: 68,
    title: "Text Justification",
    difficulty: "Hard",
    category: "String",
    description: "Given an array of `words` and a width `maxWidth`, format the text such that each line has exactly `maxWidth` characters and is fully (left and right) justified. The last line should be left-justified.",
    examples: [
        "Input: words = [\"This\",\"is\",\"an\",\"example\",\"of\",\"text\",\"justification.\"], maxWidth = 16\nOutput: [\n  \"This    is    an\",\n  \"example  of text\",\n  \"justification.  \"\n]"
    ],
    thinkingProcess: [
        { step: "Pack words greedily", detail: "For each line, greedily pack as many words as possible (word + space between). Stop when next word would exceed maxWidth." },
        { step: "Distribute extra spaces", detail: "Calculate total extra spaces = maxWidth - sum of word lengths. Distribute evenly among gaps. If not even, left gaps get one more." },
        { step: "Special cases", detail: "(1) Last line: left-justified (single space between, pad right with spaces). (2) Line with one word: left-justify, pad right." },
        { step: "Extra space distribution formula", detail: "gaps = wordCount - 1. spaces_per_gap = extraSpaces // gaps. extra = extraSpaces % gaps. First `extra` gaps get spaces_per_gap+1, rest get spaces_per_gap." },
        { step: "Implementation", detail: "For each line: find words that fit. If last line or 1 word, left-justify. Otherwise, distribute spaces evenly." }
    ],
    keyInsight: "Greedy packing + even space distribution. Extra spaces go to leftmost gaps first. Special handling for last line (left-justify) and single-word lines.",
    approach: "Pack words per line greedily. For each line: calculate extra spaces. Distribute evenly (more to left). Left-justify last line.",
    solutionPython: `def fullJustify(words, maxWidth):
    result = []
    i = 0
    
    while i < len(words):
        # Pack words for this line
        line_words = [words[i]]
        line_len = len(words[i])
        i += 1
        while i < len(words) and line_len + 1 + len(words[i]) <= maxWidth:
            line_len += 1 + len(words[i])
            line_words.append(words[i])
            i += 1
        
        # Last line or single word: left justify
        if i == len(words) or len(line_words) == 1:
            line = ' '.join(line_words)
            result.append(line + ' ' * (maxWidth - len(line)))
        else:
            # Distribute spaces
            total_spaces = maxWidth - sum(len(w) for w in line_words)
            gaps = len(line_words) - 1
            space_per = total_spaces // gaps
            extra = total_spaces % gaps
            
            line = ''
            for j, word in enumerate(line_words):
                line += word
                if j < gaps:
                    line += ' ' * (space_per + (1 if j < extra else 0))
            result.append(line)
    
    return result`,
    solutionCpp: `vector<string> fullJustify(vector<string>& words, int maxWidth) {
    vector<string> result;
    int i = 0, n = words.size();
    
    while (i < n) {
        int j = i, lineLen = 0;
        while (j < n && lineLen + words[j].size() + (j - i) <= maxWidth)
            lineLen += words[j++].size();
        
        int gaps = j - i - 1;
        string line;
        
        if (j == n || gaps == 0) { // last line or single word
            for (int k = i; k < j; k++) {
                if (k > i) line += ' ';
                line += words[k];
            }
            line += string(maxWidth - line.size(), ' ');
        } else {
            int totalSpaces = maxWidth - lineLen;
            int spacePer = totalSpaces / gaps;
            int extra = totalSpaces % gaps;
            for (int k = i; k < j; k++) {
                if (k > i) line += string(spacePer + (k-i <= extra ? 1 : 0), ' ');
                line += words[k];
            }
        }
        result.push_back(line);
        i = j;
    }
    return result;
}`,
    timeComplexity: "O(n) where n = total characters",
    spaceComplexity: "O(maxWidth) per line",
    patternGuide: "Use **greedy packing + formatting** when:\n- Text formatting/justification\n- Packing items into fixed-width bins\n- Even distribution of gaps\n\nSimilar: Sentence Screen Fitting, Rearrange Spaces Between Words"
},
{
    id: 88,
    lcNumber: 336,
    title: "Palindrome Pairs",
    difficulty: "Hard",
    category: "String",
    description: "Given a list of unique words, return all pairs `[i, j]` where the concatenation `words[i] + words[j]` is a palindrome.",
    examples: [
        "Input: words = [\"abcd\",\"dcba\",\"lls\",\"s\",\"sssll\"]\nOutput: [[0,1],[1,0],[3,2],[2,4]]\nExplanation: \"abcddcba\", \"dcbaabcd\", \"slls\", \"llssssll\""
    ],
    thinkingProcess: [
        { step: "Brute force", detail: "Check all pairs: O(n² × k). Too slow for large n. Need a smarter approach." },
        { step: "Key observation", detail: "For words[i] + words[j] to be palindrome: either words[j] is the reverse of a prefix of words[i] (with palindromic suffix), or words[i] is the reverse of a suffix of words[j] (with palindromic prefix)." },
        { step: "Hash map of reverses", detail: "Store reverse of each word in a map. For each word, check if any of its prefixes/suffixes, when reversed, exist in the map." },
        { step: "Three cases per word", detail: "For word w at index i: (1) reverse(w) exists at index j → [i,j] works. (2) w has a palindromic suffix, and reverse of prefix exists → [i,j]. (3) w has palindromic prefix, reverse of suffix exists → [j,i]." },
        { step: "Empty string case", detail: "If \"\" is in the list, it pairs with any palindromic word." }
    ],
    keyInsight: "Hash map all reversed words. For each word, check all prefix/suffix splits. If the prefix's reverse exists and the suffix is a palindrome (or vice versa), it's a valid pair.",
    approach: "Map reversed words → indices. For each word, check all splits: if one part is palindrome and the reverse of the other exists in map, record the pair.",
    solutionPython: `def palindromePairs(words):
    word_map = {w[::-1]: i for i, w in enumerate(words)}
    result = []
    
    for i, word in enumerate(words):
        for j in range(len(word) + 1):
            prefix, suffix = word[:j], word[j:]
            
            # If suffix is palindrome, check if reverse of prefix exists
            if suffix == suffix[::-1] and prefix in word_map and word_map[prefix] != i:
                result.append([i, word_map[prefix]])
            
            # If prefix is palindrome, check if reverse of suffix exists
            if j > 0 and prefix == prefix[::-1] and suffix in word_map and word_map[suffix] != i:
                result.append([word_map[suffix], i])
    
    return result`,
    solutionCpp: `vector<vector<int>> palindromePairs(vector<string>& words) {
    unordered_map<string, int> rmap;
    for (int i = 0; i < words.size(); i++) {
        string rev = words[i];
        reverse(rev.begin(), rev.end());
        rmap[rev] = i;
    }
    
    auto isPalin = [](string& s, int l, int r) {
        while (l < r) if (s[l++] != s[r--]) return false;
        return true;
    };
    
    vector<vector<int>> result;
    for (int i = 0; i < words.size(); i++) {
        string& w = words[i];
        int n = w.size();
        for (int j = 0; j <= n; j++) {
            string prefix = w.substr(0, j), suffix = w.substr(j);
            string rpre = prefix, rsuf = suffix;
            reverse(rpre.begin(), rpre.end());
            reverse(rsuf.begin(), rsuf.end());
            
            if (isPalin(w, j, n-1) && rmap.count(prefix) && rmap[prefix] != i)
                result.push_back({i, rmap[prefix]});
            if (j > 0 && isPalin(w, 0, j-1) && rmap.count(suffix) && rmap[suffix] != i)
                result.push_back({rmap[suffix], i});
        }
    }
    return result;
}`,
    timeComplexity: "O(n × k²) where k = max word length",
    spaceComplexity: "O(n × k)",
    patternGuide: "Use **hash map + palindrome prefix/suffix decomposition** when:\n- Finding palindrome pairs from a dictionary\n- Combining string reversal with palindrome checking\n- Decomposing words into prefix + suffix for matching\n\nSimilar: Longest Palindromic Substring, Shortest Palindrome"
},
// ============================================================
// CATEGORY: MATH / BIT MANIPULATION (Problems 89-92)
// ============================================================
{
    id: 89,
    lcNumber: 29,
    title: "Divide Two Integers",
    difficulty: "Medium",
    category: "Math / Bit Manipulation",
    description: "Given two integers `dividend` and `divisor`, divide without using multiplication, division, or mod. Return the quotient truncated toward zero. Assume 32-bit signed integers.",
    examples: [
        "Input: dividend = 10, divisor = 3\nOutput: 3",
        "Input: dividend = 7, divisor = -2\nOutput: -3"
    ],
    thinkingProcess: [
        { step: "Repeated subtraction", detail: "Naive: subtract divisor from dividend until < divisor. Count subtractions = quotient. But this is O(dividend/divisor) — too slow for large values." },
        { step: "Exponential growth", detail: "Instead, double the divisor each step (shift left). Find the largest `divisor * 2^k` ≤ remaining dividend. Subtract it, add `2^k` to quotient. Repeat." },
        { step: "Bit shifting", detail: "Doubling = left shift. So we're finding how many of each power-of-2 multiple of divisor fits into dividend." },
        { step: "Handle signs", detail: "Work with positive values. Track the sign separately. Apply at the end." },
        { step: "Overflow", detail: "The only overflow case: MIN_INT / -1 = MAX_INT + 1. Handle this edge case explicitly." }
    ],
    keyInsight: "Exponential search: double the divisor using bit shifts until it exceeds the dividend. Then subtract the largest multiple and repeat. This gives O(log²n) time without multiplication.",
    approach: "Work with absolute values. Repeatedly: find largest (divisor << k) ≤ dividend, subtract it, add (1 << k) to quotient. Handle sign and overflow.",
    solutionPython: `def divide(dividend, divisor):
    MAX = 2**31 - 1
    MIN = -2**31
    
    if dividend == MIN and divisor == -1:
        return MAX
    
    sign = -1 if (dividend < 0) ^ (divisor < 0) else 1
    a, b = abs(dividend), abs(divisor)
    quotient = 0
    
    while a >= b:
        temp, power = b, 1
        while a >= (temp << 1):
            temp <<= 1
            power <<= 1
        a -= temp
        quotient += power
    
    return sign * quotient`,
    solutionCpp: `int divide(int dividend, int divisor) {
    if (dividend == INT_MIN && divisor == -1) return INT_MAX;
    
    int sign = (dividend > 0) ^ (divisor > 0) ? -1 : 1;
    long a = abs((long)dividend), b = abs((long)divisor);
    long quotient = 0;
    
    while (a >= b) {
        long temp = b, power = 1;
        while (a >= (temp << 1)) {
            temp <<= 1;
            power <<= 1;
        }
        a -= temp;
        quotient += power;
    }
    return sign * quotient;
}`,
    timeComplexity: "O(log²n)",
    spaceComplexity: "O(1)",
    patternGuide: "Use **exponential search with bit shifts** when:\n- Division without multiply/divide operators\n- Finding quotients efficiently\n- Doubling technique for fast convergence\n\nSimilar: Pow(x,n), Sqrt(x)"
},
{
    id: 90,
    lcNumber: 50,
    title: "Pow(x, n)",
    difficulty: "Medium",
    category: "Math / Bit Manipulation",
    description: "Implement `pow(x, n)`, which calculates `x` raised to the power `n`.",
    examples: [
        "Input: x = 2.0, n = 10\nOutput: 1024.0",
        "Input: x = 2.1, n = 3\nOutput: 9.261",
        "Input: x = 2.0, n = -2\nOutput: 0.25"
    ],
    thinkingProcess: [
        { step: "Naive O(n)", detail: "Multiply x by itself n times. Too slow for large n (up to 2^31)." },
        { step: "Fast exponentiation (binary)", detail: "x^n = (x^(n/2))^2 if n is even. x^n = x × (x^(n/2))^2 if n is odd. This halves n each step → O(log n)." },
        { step: "Negative exponent", detail: "x^(-n) = 1 / x^n. Handle by computing x^|n| and inverting." },
        { step: "Iterative approach", detail: "Decompose n into binary. For each set bit, multiply the corresponding power. Example: x^13 = x^(1101) = x^8 × x^4 × x^1." },
        { step: "Overflow care", detail: "n can be INT_MIN. |INT_MIN| > INT_MAX. Use long or handle specially." }
    ],
    keyInsight: "Binary exponentiation: square x at each step, multiply into result when the bit is set. Reduces O(n) to O(log n). Handle negative exponent by inverting.",
    approach: "If n < 0: invert x, negate n. Iterate: if n is odd, multiply result by x. Square x, halve n. Return result.",
    solutionPython: `def myPow(x, n):
    if n < 0:
        x = 1 / x
        n = -n
    
    result = 1
    while n > 0:
        if n % 2 == 1:
            result *= x
        x *= x
        n //= 2
    
    return result`,
    solutionCpp: `double myPow(double x, int n) {
    long power = n;
    if (power < 0) { x = 1.0 / x; power = -power; }
    
    double result = 1.0;
    while (power > 0) {
        if (power & 1) result *= x;
        x *= x;
        power >>= 1;
    }
    return result;
}`,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    patternGuide: "Use **binary exponentiation** when:\n- Computing x^n efficiently\n- Matrix exponentiation for recurrences\n- Modular exponentiation in cryptography\n\nSimilar: Divide Two Integers, Sqrt(x), Super Pow"
},
{
    id: 91,
    lcNumber: 166,
    title: "Fraction to Recurring Decimal",
    difficulty: "Medium",
    category: "Math / Bit Manipulation",
    description: "Given two integers representing the numerator and denominator of a fraction, return the fraction in string format. If the fractional part is repeating, enclose the repeating part in parentheses.",
    examples: [
        "Input: numerator = 1, denominator = 2\nOutput: \"0.5\"",
        "Input: numerator = 2, denominator = 1\nOutput: \"2\"",
        "Input: numerator = 4, denominator = 333\nOutput: \"0.(012)\""
    ],
    thinkingProcess: [
        { step: "Long division simulation", detail: "Simulate the long division process we do by hand. Track the quotient and remainders." },
        { step: "Detecting repetition", detail: "A repeating cycle occurs when we see a remainder we've seen before. At that point, the digits between the first and second occurrence of that remainder form the repeating part." },
        { step: "Use a hash map", detail: "Map each remainder to its position in the result string. When a remainder repeats, insert '(' at the mapped position and ')' at the end." },
        { step: "Handle sign", detail: "If exactly one of numerator/denominator is negative, result is negative. Handle the sign separately." },
        { step: "Handle integer part", detail: "Compute integer division first. If no remainder, return. Otherwise, add '.' and simulate decimal division." }
    ],
    keyInsight: "Simulate long division. Track remainders in a hash map (remainder → position in result). When a remainder repeats, insert parentheses around the repeating cycle.",
    approach: "Handle sign. Integer part. If remainder != 0: decimal part via long division, tracking remainders. On repeat, add parentheses.",
    solutionPython: `def fractionToDecimal(numerator, denominator):
    if numerator == 0:
        return "0"
    
    result = []
    # Handle sign
    if (numerator < 0) ^ (denominator < 0):
        result.append('-')
    
    num, den = abs(numerator), abs(denominator)
    
    # Integer part
    result.append(str(num // den))
    remainder = num % den
    
    if remainder == 0:
        return ''.join(result)
    
    result.append('.')
    remainder_map = {}
    
    while remainder != 0:
        if remainder in remainder_map:
            result.insert(remainder_map[remainder], '(')
            result.append(')')
            break
        
        remainder_map[remainder] = len(result)
        remainder *= 10
        result.append(str(remainder // den))
        remainder %= den
    
    return ''.join(result)`,
    solutionCpp: `string fractionToDecimal(int numerator, int denominator) {
    if (numerator == 0) return "0";
    string result;
    if ((numerator < 0) ^ (denominator < 0)) result += '-';
    
    long num = abs((long)numerator), den = abs((long)denominator);
    result += to_string(num / den);
    long rem = num % den;
    if (rem == 0) return result;
    
    result += '.';
    unordered_map<long, int> remMap;
    
    while (rem != 0) {
        if (remMap.count(rem)) {
            result.insert(remMap[rem], "(");
            result += ')';
            break;
        }
        remMap[rem] = result.size();
        rem *= 10;
        result += to_string(rem / den);
        rem %= den;
    }
    return result;
}`,
    timeComplexity: "O(denominator) worst case",
    spaceComplexity: "O(denominator)",
    patternGuide: "Use **long division simulation** when:\n- Converting fractions to decimals\n- Detecting repeating cycles\n- Remainder tracking with hash map\n\nSimilar: Other math/number conversion problems"
},
{
    id: 92,
    lcNumber: 137,
    title: "Single Number II",
    difficulty: "Medium",
    category: "Math / Bit Manipulation",
    description: "Given an integer array `nums` where every element appears three times except for one which appears exactly once. Find the single one. You must implement a linear runtime solution with constant extra space.",
    examples: [
        "Input: nums = [2,2,3,2]\nOutput: 3",
        "Input: nums = [0,1,0,1,0,1,99]\nOutput: 99"
    ],
    thinkingProcess: [
        { step: "Bit counting approach", detail: "For each bit position, count the total number of 1s across all numbers. If a bit appears 3k+1 times, the single number has a 1 at that position." },
        { step: "Why mod 3?", detail: "Numbers appearing 3 times contribute 0 or 3 to each bit's count. The remainder mod 3 gives the single number's bit." },
        { step: "Generalized approach", detail: "For each of 32 bit positions: sum = count of 1s. If sum % 3 != 0, the single number has a 1 there." },
        { step: "Bitwise state machine (advanced)", detail: "Track bits with two variables `ones` and `twos`. `ones` holds bits appearing once, `twos` holds bits appearing twice. When a bit appears 3 times, clear it from both." },
        { step: "State transitions", detail: "`ones = (ones ^ num) & ~twos`. `twos = (twos ^ num) & ~ones`. This encodes a 3-state counter per bit. After all numbers, `ones` = single number." }
    ],
    keyInsight: "Bit counting: for each bit position, count 1s mod 3. Build the single number from bits where count % 3 == 1. Or use a bitwise state machine (ones, twos) for elegant O(1) space.",
    approach: "For each of 32 bits: count 1s across all nums. If count % 3 == 1, set that bit in result. Or: state machine with `ones` and `twos` variables.",
    solutionPython: `def singleNumber(nums):
    ones, twos = 0, 0
    
    for num in nums:
        ones = (ones ^ num) & ~twos
        twos = (twos ^ num) & ~ones
    
    return ones`,
    solutionCpp: `int singleNumber(vector<int>& nums) {
    int ones = 0, twos = 0;
    for (int num : nums) {
        ones = (ones ^ num) & ~twos;
        twos = (twos ^ num) & ~ones;
    }
    return ones;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    patternGuide: "Use **bitwise state machine** when:\n- Finding element appearing k times among elements appearing m times\n- Bit counting with modular arithmetic\n- XOR-based single number variants\n\nSimilar: Single Number (XOR), Single Number III, Missing Number"
},
// ============================================================
// CATEGORY: DESIGN (Problems 93-97)
// ============================================================
{
    id: 93,
    lcNumber: 146,
    title: "LRU Cache",
    difficulty: "Medium",
    category: "Design",
    description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement `get(key)` and `put(key, value)` in O(1) time.",
    examples: [
        "LRUCache(2), put(1,1), put(2,2), get(1)→1, put(3,3) → evicts key 2, get(2)→-1, put(4,4) → evicts key 1, get(1)→-1, get(3)→3, get(4)→4"
    ],
    thinkingProcess: [
        { step: "Requirements", detail: "get and put must be O(1). We need fast lookup (hash map) AND fast ordering by recency (linked list)." },
        { step: "Hash map + doubly linked list", detail: "Hash map: key → node for O(1) lookup. Doubly linked list: maintains order (most recent at front, least recent at back). Moving/removing nodes is O(1)." },
        { step: "On get(key)", detail: "Look up in hash map. If exists, move to front of list (most recently used). Return value." },
        { step: "On put(key, value)", detail: "If key exists, update value and move to front. If new and at capacity, remove the least recently used (back of list) from both list and map. Add new entry to front." },
        { step: "Sentinel nodes", detail: "Use dummy head and tail nodes to avoid null checks when inserting/removing. Simplifies code significantly." }
    ],
    keyInsight: "Hash map (O(1) lookup) + doubly linked list (O(1) move to front / remove from back). Together they give O(1) for both get and put. Dummy head/tail simplify edge cases.",
    approach: "HashMap: key→Node. Doubly linked list with dummy head/tail. Get: find, move to front. Put: add/update at front, evict from back if over capacity.",
    solutionPython: `class Node:
    def __init__(self, key=0, val=0):
        self.key, self.val = key, val
        self.prev = self.next = None

class LRUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.cache = {}
        self.head, self.tail = Node(), Node()
        self.head.next, self.tail.prev = self.tail, self.head
    
    def _remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev
    
    def _add_front(self, node):
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node
    
    def get(self, key):
        if key not in self.cache:
            return -1
        node = self.cache[key]
        self._remove(node)
        self._add_front(node)
        return node.val
    
    def put(self, key, value):
        if key in self.cache:
            self._remove(self.cache[key])
        node = Node(key, value)
        self._add_front(node)
        self.cache[key] = node
        
        if len(self.cache) > self.cap:
            lru = self.tail.prev
            self._remove(lru)
            del self.cache[lru.key]`,
    solutionCpp: `class LRUCache {
    int cap;
    list<pair<int,int>> dll; // (key, val), front = most recent
    unordered_map<int, list<pair<int,int>>::iterator> cache;
    
public:
    LRUCache(int capacity) : cap(capacity) {}
    
    int get(int key) {
        if (!cache.count(key)) return -1;
        dll.splice(dll.begin(), dll, cache[key]); // move to front
        return cache[key]->second;
    }
    
    void put(int key, int value) {
        if (cache.count(key)) {
            dll.splice(dll.begin(), dll, cache[key]);
            cache[key]->second = value;
            return;
        }
        if (dll.size() == cap) {
            cache.erase(dll.back().first);
            dll.pop_back();
        }
        dll.push_front({key, value});
        cache[key] = dll.begin();
    }
};`,
    timeComplexity: "O(1) for both get and put",
    spaceComplexity: "O(capacity)",
    patternGuide: "Use **hash map + doubly linked list** when:\n- O(1) access + O(1) ordering operations\n- LRU, LFU, or MRU caches\n- Need both fast lookup and fast reordering\n\nSimilar: LFU Cache, All O'one Data Structure"
},
{
    id: 94,
    lcNumber: 380,
    title: "Insert Delete GetRandom O(1)",
    difficulty: "Medium",
    category: "Design",
    description: "Implement `RandomizedSet` class with `insert`, `remove`, and `getRandom` all in average O(1) time.",
    examples: [
        "insert(1)→true, remove(2)→false, insert(2)→true, getRandom()→1 or 2, remove(1)→true, insert(2)→false, getRandom()→2"
    ],
    thinkingProcess: [
        { step: "GetRandom in O(1)", detail: "Random access requires an array (pick random index). But arrays have O(n) removal." },
        { step: "O(1) removal from array", detail: "Trick: swap the element to remove with the last element, then pop from the end. This is O(1)!" },
        { step: "O(1) lookup for swap", detail: "We need to know WHERE the element is in the array. Use a hash map: value → index." },
        { step: "Combined design", detail: "Array for O(1) random access. Hash map for O(1) lookup. Swap-to-back for O(1) removal." },
        { step: "Insert", detail: "Append to array. Record index in map." },
        { step: "Remove", detail: "Swap with last element. Update map for the swapped element. Pop last. Delete from map." }
    ],
    keyInsight: "Array + hash map (value→index). Insert: append + map. Remove: swap with last element + pop + update map. GetRandom: random array index. All O(1).",
    approach: "ArrayList + HashMap. Insert: append, map. Remove: swap-to-back, pop, update map. Random: random index.",
    solutionPython: `import random

class RandomizedSet:
    def __init__(self):
        self.nums = []
        self.index_map = {}
    
    def insert(self, val):
        if val in self.index_map:
            return False
        self.index_map[val] = len(self.nums)
        self.nums.append(val)
        return True
    
    def remove(self, val):
        if val not in self.index_map:
            return False
        idx = self.index_map[val]
        last = self.nums[-1]
        # Swap with last
        self.nums[idx] = last
        self.index_map[last] = idx
        # Remove last
        self.nums.pop()
        del self.index_map[val]
        return True
    
    def getRandom(self):
        return random.choice(self.nums)`,
    solutionCpp: `class RandomizedSet {
    vector<int> nums;
    unordered_map<int,int> indexMap;
    
public:
    bool insert(int val) {
        if (indexMap.count(val)) return false;
        indexMap[val] = nums.size();
        nums.push_back(val);
        return true;
    }
    
    bool remove(int val) {
        if (!indexMap.count(val)) return false;
        int idx = indexMap[val], last = nums.back();
        nums[idx] = last;
        indexMap[last] = idx;
        nums.pop_back();
        indexMap.erase(val);
        return true;
    }
    
    int getRandom() {
        return nums[rand() % nums.size()];
    }
};`,
    timeComplexity: "O(1) average for all operations",
    spaceComplexity: "O(n)",
    patternGuide: "Use **array + hash map with swap-to-back** when:\n- Need O(1) insert, delete, AND random access\n- Swap-to-back trick enables O(1) array deletion\n- Common design pattern interview question\n\nSimilar: Insert Delete GetRandom O(1) - Duplicates allowed"
},
{
    id: 95,
    lcNumber: 460,
    title: "LFU Cache",
    difficulty: "Hard",
    category: "Design",
    description: "Design a Least Frequently Used (LFU) cache. Implement `get(key)` and `put(key, value)` in O(1) time. When capacity is reached, invalidate the least frequently used key. If there's a tie, invalidate the least recently used among them.",
    examples: [
        "LFUCache(2), put(1,1), put(2,2), get(1)→1, put(3,3) → evicts key 2 (freq 1, least recent), get(2)→-1, get(3)→3, put(4,4) → evicts key 1 (freq 2, but tie broken by LRU), get(1)→-1"
    ],
    thinkingProcess: [
        { step: "Track frequency per key", detail: "Each key has a frequency count. On access, frequency increases. Evict the least frequent." },
        { step: "O(1) eviction requires knowing min frequency", detail: "Maintain a `minFreq` variable. When we need to evict, look at the bucket for minFreq and remove the LRU item from that bucket." },
        { step: "Frequency → LRU list", detail: "Map: frequency → doubly linked list (ordered by recency). Each frequency bucket is an LRU list. This handles ties (same freq → evict LRU)." },
        { step: "Key → (value, freq)", detail: "Hash map from key → (value, frequency, node reference). For O(1) access." },
        { step: "On get/put", detail: "Remove node from old freq list. Increment freq. Add to new freq list. If old freq list is empty and was minFreq, increment minFreq." }
    ],
    keyInsight: "Three data structures: key→(val,freq,node), freq→LRU list (doubly linked list), and minFreq tracker. Access moves key from freq f list to freq f+1 list. Eviction removes from minFreq list's tail.",
    approach: "HashMap key→info. HashMap freq→OrderedDict. Track minFreq. Get: move to freq+1. Put: add at freq 1, evict from minFreq if needed.",
    solutionPython: `from collections import defaultdict, OrderedDict

class LFUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.min_freq = 0
        self.key_map = {}             # key → (val, freq)
        self.freq_map = defaultdict(OrderedDict)  # freq → OrderedDict of key→val
    
    def get(self, key):
        if key not in self.key_map:
            return -1
        val, freq = self.key_map[key]
        del self.freq_map[freq][key]
        if not self.freq_map[freq]:
            del self.freq_map[freq]
            if self.min_freq == freq:
                self.min_freq += 1
        self.freq_map[freq + 1][key] = val
        self.key_map[key] = (val, freq + 1)
        return val
    
    def put(self, key, value):
        if self.cap <= 0:
            return
        if key in self.key_map:
            self.key_map[key] = (value, self.key_map[key][1])
            self.get(key)  # update freq
            self.key_map[key] = (value, self.key_map[key][1])
            return
        if len(self.key_map) >= self.cap:
            # Evict LFU (LRU among ties)
            evict_key, _ = self.freq_map[self.min_freq].popitem(last=False)
            if not self.freq_map[self.min_freq]:
                del self.freq_map[self.min_freq]
            del self.key_map[evict_key]
        self.key_map[key] = (value, 1)
        self.freq_map[1][key] = value
        self.min_freq = 1`,
    solutionCpp: `class LFUCache {
    int cap, minFreq;
    unordered_map<int, pair<int,int>> keyMap; // key → (val, freq)
    unordered_map<int, list<int>> freqList;   // freq → list of keys (LRU order)
    unordered_map<int, list<int>::iterator> keyIter; // key → position in freq list
    
public:
    LFUCache(int capacity) : cap(capacity), minFreq(0) {}
    
    int get(int key) {
        if (!keyMap.count(key)) return -1;
        auto& [val, freq] = keyMap[key];
        freqList[freq].erase(keyIter[key]);
        if (freqList[freq].empty()) {
            freqList.erase(freq);
            if (minFreq == freq) minFreq++;
        }
        freq++;
        freqList[freq].push_back(key);
        keyIter[key] = prev(freqList[freq].end());
        return val;
    }
    
    void put(int key, int value) {
        if (cap <= 0) return;
        if (keyMap.count(key)) {
            keyMap[key].first = value;
            get(key);
            return;
        }
        if (keyMap.size() == cap) {
            int evict = freqList[minFreq].front();
            freqList[minFreq].pop_front();
            if (freqList[minFreq].empty()) freqList.erase(minFreq);
            keyMap.erase(evict);
            keyIter.erase(evict);
        }
        keyMap[key] = {value, 1};
        freqList[1].push_back(key);
        keyIter[key] = prev(freqList[1].end());
        minFreq = 1;
    }
};`,
    timeComplexity: "O(1) for both get and put",
    spaceComplexity: "O(capacity)",
    patternGuide: "Use **freq buckets + LRU lists + minFreq tracker** when:\n- LFU cache with O(1) operations\n- Need both frequency and recency tracking\n- Eviction by frequency, then recency for ties\n\nSimilar: LRU Cache, All O'one Data Structure"
},
{
    id: 96,
    lcNumber: 355,
    title: "Design Twitter",
    difficulty: "Medium",
    category: "Design",
    description: "Design a simplified Twitter. Users can post tweets, follow/unfollow other users, and see the 10 most recent tweets in their news feed (from themselves and people they follow).",
    examples: [
        "postTweet(1,'tweet5'), getNewsFeed(1)→[5], follow(1,2), postTweet(2,'tweet6'), getNewsFeed(1)→[6,5], unfollow(1,2), getNewsFeed(1)→[5]"
    ],
    thinkingProcess: [
        { step: "Data structures needed", detail: "User → set of followees. User → list of tweets (with timestamps). Global timestamp counter." },
        { step: "GetNewsFeed = merge k sorted lists", detail: "Get tweet lists from user and all followees. Merge and take top 10. This is the Merge K Sorted Lists problem!" },
        { step: "Use a min-heap of size 10", detail: "Push the most recent tweet from each followee. Pop minimum (oldest), push their next tweet. Or use max-heap and extract 10." },
        { step: "Efficient tweet storage", detail: "Store tweets as (timestamp, tweetId) in reverse chronological order per user. Only need to look at the 10 most recent per user." },
        { step: "Follow/Unfollow", detail: "User → HashSet of followees. Follow: add. Unfollow: remove. Users always follow themselves." }
    ],
    keyInsight: "GetNewsFeed is a k-way merge of tweet lists (from user + followees). Use a max-heap to merge and extract top 10. Store tweets with timestamps for ordering.",
    approach: "HashMap: user → followees set, user → tweet list. PostTweet: add with timestamp. GetNewsFeed: merge k lists (heap). Follow/Unfollow: update set.",
    solutionPython: `import heapq
from collections import defaultdict

class Twitter:
    def __init__(self):
        self.time = 0
        self.tweets = defaultdict(list)   # userId → [(time, tweetId)]
        self.follows = defaultdict(set)    # userId → set of followees
    
    def postTweet(self, userId, tweetId):
        self.time += 1
        self.tweets[userId].append((self.time, tweetId))
    
    def getNewsFeed(self, userId):
        self.follows[userId].add(userId)  # follow self
        heap = []
        
        for followee in self.follows[userId]:
            tweets = self.tweets[followee]
            if tweets:
                idx = len(tweets) - 1
                t, tid = tweets[idx]
                heap.append((-t, tid, followee, idx))
        
        heapq.heapify(heap)
        feed = []
        
        while heap and len(feed) < 10:
            neg_t, tid, followee, idx = heapq.heappop(heap)
            feed.append(tid)
            if idx > 0:
                t, tid = self.tweets[followee][idx - 1]
                heapq.heappush(heap, (-t, tid, followee, idx - 1))
        
        return feed
    
    def follow(self, followerId, followeeId):
        self.follows[followerId].add(followeeId)
    
    def unfollow(self, followerId, followeeId):
        self.follows[followerId].discard(followeeId)`,
    solutionCpp: `class Twitter {
    int time = 0;
    unordered_map<int, vector<pair<int,int>>> tweets; // user → [(time, tweetId)]
    unordered_map<int, unordered_set<int>> follows;
    
public:
    void postTweet(int userId, int tweetId) {
        tweets[userId].push_back({++time, tweetId});
    }
    
    vector<int> getNewsFeed(int userId) {
        follows[userId].insert(userId);
        // Max-heap: (time, tweetId, userId, index)
        priority_queue<tuple<int,int,int,int>> pq;
        
        for (int f : follows[userId]) {
            auto& t = tweets[f];
            if (!t.empty()) {
                int idx = t.size() - 1;
                pq.push({t[idx].first, t[idx].second, f, idx});
            }
        }
        
        vector<int> feed;
        while (!pq.empty() && feed.size() < 10) {
            auto [t, tid, uid, idx] = pq.top(); pq.pop();
            feed.push_back(tid);
            if (idx > 0) {
                auto& tw = tweets[uid];
                pq.push({tw[idx-1].first, tw[idx-1].second, uid, idx-1});
            }
        }
        return feed;
    }
    
    void follow(int followerId, int followeeId) {
        follows[followerId].insert(followeeId);
    }
    
    void unfollow(int followerId, int followeeId) {
        follows[followerId].erase(followeeId);
    }
};`,
    timeComplexity: "O(k log k) for getNewsFeed, k = followees",
    spaceComplexity: "O(total tweets + follows)",
    patternGuide: "Use **merge k sorted lists for feeds** when:\n- News feed / timeline generation\n- Combining sorted streams from multiple sources\n- Top-K from multiple sorted lists\n\nSimilar: Merge k Sorted Lists, Design Hit Counter"
},
{
    id: 97,
    lcNumber: 1396,
    title: "Design Underground System",
    difficulty: "Medium",
    category: "Design",
    description: "Implement `UndergroundSystem` tracking customer travel times. `checkIn(id, station, time)`, `checkOut(id, station, time)`, `getAverageTime(start, end)` returns average travel time between two stations.",
    examples: [
        "checkIn(45,'Leyton',3), checkIn(32,'Paradise',8), checkOut(45,'Waterloo',15), checkOut(32,'Cambridge',22), getAverageTime('Paradise','Cambridge')→14.0, getAverageTime('Leyton','Waterloo')→12.0"
    ],
    thinkingProcess: [
        { step: "Track in-progress trips", detail: "When a customer checks in, store their start station and time. When they check out, compute the travel time." },
        { step: "Two hash maps", detail: "Map 1: customerId → (startStation, startTime) for in-progress trips. Map 2: (startStation, endStation) → (totalTime, count) for completed trips." },
        { step: "CheckIn", detail: "Store (station, time) for the customer ID." },
        { step: "CheckOut", detail: "Look up customer's check-in info. Compute duration = checkOutTime - checkInTime. Update the route's total time and count." },
        { step: "GetAverageTime", detail: "Look up (start, end) route. Return totalTime / count." }
    ],
    keyInsight: "Two maps: in-progress trips (customerId → start info) and route statistics (route → total time + count). CheckOut updates statistics. GetAverage divides total by count.",
    approach: "Map1: id → (station, time). Map2: (start,end) → (total, count). CheckIn: store. CheckOut: compute duration, update route stats. GetAverage: total/count.",
    solutionPython: `class UndergroundSystem:
    def __init__(self):
        self.check_ins = {}   # id → (station, time)
        self.routes = {}      # (start, end) → [totalTime, count]
    
    def checkIn(self, id, stationName, t):
        self.check_ins[id] = (stationName, t)
    
    def checkOut(self, id, stationName, t):
        start_station, start_time = self.check_ins.pop(id)
        route = (start_station, stationName)
        duration = t - start_time
        if route not in self.routes:
            self.routes[route] = [0, 0]
        self.routes[route][0] += duration
        self.routes[route][1] += 1
    
    def getAverageTime(self, startStation, endStation):
        total, count = self.routes[(startStation, endStation)]
        return total / count`,
    solutionCpp: `class UndergroundSystem {
    unordered_map<int, pair<string,int>> checkIns;
    map<pair<string,string>, pair<long,int>> routes;
    
public:
    void checkIn(int id, string station, int t) {
        checkIns[id] = {station, t};
    }
    
    void checkOut(int id, string station, int t) {
        auto [startStn, startTime] = checkIns[id];
        checkIns.erase(id);
        auto route = make_pair(startStn, station);
        routes[route].first += t - startTime;
        routes[route].second++;
    }
    
    double getAverageTime(string start, string end) {
        auto& [total, count] = routes[{start, end}];
        return (double)total / count;
    }
};`,
    timeComplexity: "O(1) for all operations",
    spaceComplexity: "O(n) for trips and routes",
    patternGuide: "Use **in-progress map + aggregation map** when:\n- Tracking start/end events for entities\n- Computing running averages\n- Pairing check-in/check-out events\n\nSimilar: Design Hit Counter, Logger Rate Limiter"
},
// ============================================================
// CATEGORY: MATRIX (Problems 98-100)
// ============================================================
{
    id: 98,
    lcNumber: 48,
    title: "Rotate Image",
    difficulty: "Medium",
    category: "Matrix",
    description: "You are given an `n x n` 2D matrix representing an image. Rotate the image by 90 degrees clockwise. You have to rotate it in-place.",
    examples: [
        "Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]\nOutput: [[7,4,1],[8,5,2],[9,6,3]]"
    ],
    thinkingProcess: [
        { step: "Observation: 90° clockwise rotation", detail: "Element at (r, c) goes to (c, n-1-r). But doing this directly in-place causes overwrites." },
        { step: "Two-step approach: transpose + reverse", detail: "Step 1: Transpose the matrix (swap (i,j) with (j,i)). Step 2: Reverse each row. This gives 90° clockwise rotation." },
        { step: "Why transpose + reverse = rotate", detail: "Transpose maps (r,c)→(c,r). Reverse maps (c,r)→(c,n-1-r). Combined: (r,c)→(c,n-1-r), which is exactly 90° clockwise." },
        { step: "In-place transpose", detail: "Only swap elements above the diagonal: for i<j, swap matrix[i][j] and matrix[j][i]." },
        { step: "Other rotations", detail: "90° counter-clockwise: reverse rows, then transpose. 180°: reverse rows, then reverse columns." }
    ],
    keyInsight: "90° clockwise = transpose + reverse each row. Transpose: swap (i,j) with (j,i). Reverse: reverse each row. Both are in-place O(1) extra space.",
    approach: "1. Transpose: swap matrix[i][j] with matrix[j][i] for i < j. 2. Reverse each row.",
    solutionPython: `def rotate(matrix):
    n = len(matrix)
    
    # Transpose
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    
    # Reverse each row
    for row in matrix:
        row.reverse()`,
    solutionCpp: `void rotate(vector<vector<int>>& matrix) {
    int n = matrix.size();
    // Transpose
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            swap(matrix[i][j], matrix[j][i]);
    // Reverse each row
    for (auto& row : matrix)
        reverse(row.begin(), row.end());
}`,
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    patternGuide: "Use **transpose + reverse** when:\n- Rotating a matrix 90° clockwise\n- In-place matrix transformation\n- Understanding that rotation = two simpler operations\n\nSimilar: Spiral Matrix, Reshape the Matrix"
},
{
    id: 99,
    lcNumber: 54,
    title: "Spiral Matrix",
    difficulty: "Medium",
    category: "Matrix",
    description: "Given an `m x n` matrix, return all elements of the matrix in spiral order.",
    examples: [
        "Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]\nOutput: [1,2,3,6,9,8,7,4,5]",
        "Input: matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]\nOutput: [1,2,3,4,8,12,11,10,9,5,6,7]"
    ],
    thinkingProcess: [
        { step: "Layer by layer", detail: "Process the matrix in layers (shells) from outside to inside. Each layer is a rectangle perimeter." },
        { step: "Four boundaries", detail: "Track top, bottom, left, right boundaries. Process: top row (left→right), right column (top→bottom), bottom row (right→left), left column (bottom→top). Then shrink boundaries." },
        { step: "Shrink after each side", detail: "After processing top row: top++. After right column: right--. After bottom row: bottom--. After left column: left++." },
        { step: "Check boundaries before reverse traversals", detail: "Before processing bottom row, check top <= bottom (might have already been processed). Same for left column: check left <= right." },
        { step: "Termination", detail: "Stop when top > bottom or left > right." }
    ],
    keyInsight: "Process in layers: right→down→left→up. Track four boundaries (top, bottom, left, right). Shrink after each direction. Check bounds before reverse passes.",
    approach: "While top≤bottom and left≤right: traverse right, down, left (if top≤bottom), up (if left≤right). Shrink boundaries each step.",
    solutionPython: `def spiralOrder(matrix):
    result = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    
    while top <= bottom and left <= right:
        # Right
        for c in range(left, right + 1):
            result.append(matrix[top][c])
        top += 1
        
        # Down
        for r in range(top, bottom + 1):
            result.append(matrix[r][right])
        right -= 1
        
        # Left
        if top <= bottom:
            for c in range(right, left - 1, -1):
                result.append(matrix[bottom][c])
            bottom -= 1
        
        # Up
        if left <= right:
            for r in range(bottom, top - 1, -1):
                result.append(matrix[r][left])
            left += 1
    
    return result`,
    solutionCpp: `vector<int> spiralOrder(vector<vector<int>>& matrix) {
    vector<int> result;
    int top = 0, bottom = matrix.size()-1;
    int left = 0, right = matrix[0].size()-1;
    
    while (top <= bottom && left <= right) {
        for (int c = left; c <= right; c++) result.push_back(matrix[top][c]);
        top++;
        for (int r = top; r <= bottom; r++) result.push_back(matrix[r][right]);
        right--;
        if (top <= bottom) {
            for (int c = right; c >= left; c--) result.push_back(matrix[bottom][c]);
            bottom--;
        }
        if (left <= right) {
            for (int r = bottom; r >= top; r--) result.push_back(matrix[r][left]);
            left++;
        }
    }
    return result;
}`,
    timeComplexity: "O(m × n)",
    spaceComplexity: "O(1) excluding output",
    patternGuide: "Use **four-boundary spiral** when:\n- Traversing matrix in spiral order\n- Generating spiral matrix\n- Layer-by-layer matrix processing\n\nSimilar: Spiral Matrix II, Diagonal Traverse"
},
{
    id: 100,
    lcNumber: 73,
    title: "Set Matrix Zeroes",
    difficulty: "Medium",
    category: "Matrix",
    description: "Given an `m x n` integer matrix, if an element is 0, set its entire row and column to 0. You must do it in place. Can you do it with O(1) extra space?",
    examples: [
        "Input: matrix = [[1,1,1],[1,0,1],[1,1,1]]\nOutput: [[1,0,1],[0,0,0],[1,0,1]]",
        "Input: matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]\nOutput: [[0,0,0,0],[0,4,5,0],[0,3,1,0]]"
    ],
    thinkingProcess: [
        { step: "Naive O(mn) space", detail: "Copy the matrix. Scan for zeroes. Set rows/columns in original. But we want O(1) space." },
        { step: "O(m+n) space", detail: "Use boolean arrays to track which rows and columns should be zeroed. Two passes: mark, then zero." },
        { step: "O(1) space: use the matrix itself", detail: "Use the first row and first column as markers! If matrix[i][j] == 0, set matrix[i][0] = 0 and matrix[0][j] = 0." },
        { step: "Handle first row/column separately", detail: "Before using them as markers, check if the first row and first column themselves contain any zeroes. Store in two boolean flags." },
        { step: "Process in three passes", detail: "Pass 1: scan matrix, mark first row/col. Track if first row/col have zeroes. Pass 2: use markers to zero interior. Pass 3: zero first row/col if needed." }
    ],
    keyInsight: "Use first row and first column as markers (O(1) space). Mark matrix[i][0] and matrix[0][j] when matrix[i][j]==0. Process interior, then handle first row/col separately.",
    approach: "1. Check if first row/col have zeros. 2. Mark: if cell=0, mark its row/col header. 3. Zero interior using markers. 4. Zero first row/col if flagged.",
    solutionPython: `def setZeroes(matrix):
    m, n = len(matrix), len(matrix[0])
    first_row_zero = any(matrix[0][j] == 0 for j in range(n))
    first_col_zero = any(matrix[i][0] == 0 for i in range(m))
    
    # Mark using first row/col
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][j] == 0:
                matrix[i][0] = 0
                matrix[0][j] = 0
    
    # Zero interior based on markers
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][0] == 0 or matrix[0][j] == 0:
                matrix[i][j] = 0
    
    # Zero first row and column if needed
    if first_row_zero:
        for j in range(n):
            matrix[0][j] = 0
    if first_col_zero:
        for i in range(m):
            matrix[i][0] = 0`,
    solutionCpp: `void setZeroes(vector<vector<int>>& matrix) {
    int m = matrix.size(), n = matrix[0].size();
    bool firstRow = false, firstCol = false;
    
    for (int j = 0; j < n; j++) if (matrix[0][j] == 0) firstRow = true;
    for (int i = 0; i < m; i++) if (matrix[i][0] == 0) firstCol = true;
    
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            if (matrix[i][j] == 0) {
                matrix[i][0] = 0;
                matrix[0][j] = 0;
            }
    
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            if (matrix[i][0] == 0 || matrix[0][j] == 0)
                matrix[i][j] = 0;
    
    if (firstRow) for (int j = 0; j < n; j++) matrix[0][j] = 0;
    if (firstCol) for (int i = 0; i < m; i++) matrix[i][0] = 0;
}`,
    timeComplexity: "O(m × n)",
    spaceComplexity: "O(1)",
    patternGuide: "Use **first row/col as markers** when:\n- Need O(1) space for matrix marking\n- The matrix itself can serve as auxiliary storage\n- Processing in multiple passes (mark, then apply)\n\nSimilar: Game of Life, Rotate Image"
},
// ============================================================
// HARD PROBLEMS BONUS SET (101-150) — Google Favorites
// ============================================================
{
    id: 101,
    lcNumber: 862,
    title: "Shortest Subarray with Sum at Least K",
    difficulty: "Hard",
    category: "Sliding Window",
    description: "Given an integer array `nums` and an integer `k`, return the length of the shortest non-empty subarray of `nums` with a sum of at least `k`. If there is no such subarray, return `-1`. Note: the array can contain negative numbers.",
    examples: [
        "Input: nums = [2,-1,2], k = 3\nOutput: 3\nExplanation: The subarray [2,-1,2] sums to 3 and has length 3.",
        "Input: nums = [1], k = 1\nOutput: 1",
        "Input: nums = [1,2], k = 4\nOutput: -1"
    ],
    thinkingProcess: [
        { step: "Why not a simple sliding window?", detail: "With positive-only arrays, a standard sliding window works because expanding always increases the sum and shrinking always decreases it. But negative numbers break this monotonicity — shrinking might increase the sum. We need a different approach." },
        { step: "Use prefix sums", detail: "Let `prefix[i]` = sum of `nums[0..i-1]`. The sum of subarray `nums[j..i-1]` = `prefix[i] - prefix[j]`. We need: find the smallest `(i - j)` such that `prefix[i] - prefix[j] >= k`, i.e., `prefix[j] <= prefix[i] - k`." },
        { step: "Think about which j values to keep", detail: "For a fixed `i`, we want the largest `j < i` with `prefix[j] <= prefix[i] - k`. If `prefix[j1] >= prefix[j2]` and `j1 < j2`, then `j1` is useless — `j2` gives a shorter subarray AND a smaller-or-equal prefix. So we maintain a monotone increasing deque of prefix values." },
        { step: "Build a monotone deque", detail: "Process prefix sums left to right. (1) Pop from front while `prefix[front] <= prefix[i] - k` — each gives a valid subarray, track min length. Once popped, it's used (any later `i` would give a longer subarray). (2) Pop from back while `prefix[back] >= prefix[i]` — they're dominated by `i`." },
        { step: "Why greedy popping from front is safe", detail: "Once `prefix[deque.front]` satisfies the condition for index `i`, any future index `i' > i` would produce a longer subarray with the same `j`. So we can permanently remove it — we've found its best match." },
        { step: "Complexity", detail: "Each index is pushed and popped at most once from the deque. Total work is O(n). This is a classic 'monotone deque' pattern that extends sliding window to handle negative numbers." }
    ],
    keyInsight: "Use prefix sums + a monotone increasing deque. The deque stores indices of prefix sums in increasing order. For each new prefix sum, pop from front to find valid short subarrays, and pop from back to maintain monotonicity. Each index is processed at most twice (pushed and popped), giving O(n) time.",
    approach: "1. Compute prefix sum array.\n2. Maintain a deque of indices with increasing prefix sums.\n3. For each `i`: pop front while `prefix[i] - prefix[front] >= k` (valid subarray, track min length). Pop back while `prefix[back] >= prefix[i]` (maintain monotonicity). Push `i`.",
    solutionPython: `from collections import deque

def shortestSubarray(nums, k):
    n = len(nums)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]
    
    dq = deque()  # stores indices into prefix[]
    ans = float('inf')
    
    for i in range(n + 1):
        # Pop from front: valid subarrays found
        while dq and prefix[i] - prefix[dq[0]] >= k:
            ans = min(ans, i - dq.popleft())
        # Pop from back: maintain increasing order
        while dq and prefix[dq[-1]] >= prefix[i]:
            dq.pop()
        dq.append(i)
    
    return ans if ans != float('inf') else -1`,
    solutionCpp: `#include <vector>
#include <deque>
using namespace std;

int shortestSubarray(vector<int>& nums, int k) {
    int n = nums.size();
    vector<long long> prefix(n + 1, 0);
    for (int i = 0; i < n; i++)
        prefix[i + 1] = prefix[i] + nums[i];
    
    deque<int> dq;
    int ans = INT_MAX;
    
    for (int i = 0; i <= n; i++) {
        while (!dq.empty() && prefix[i] - prefix[dq.front()] >= k) {
            ans = min(ans, i - dq.front());
            dq.pop_front();
        }
        while (!dq.empty() && prefix[dq.back()] >= prefix[i])
            dq.pop_back();
        dq.push_back(i);
    }
    
    return ans == INT_MAX ? -1 : ans;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    patternGuide: "Use **monotone deque + prefix sums** when:\n- Sliding window fails due to negative numbers\n- You need shortest/longest subarray with a sum condition\n- Need to efficiently find the best left boundary for each right boundary\n\nSimilar: Sliding Window Maximum, Max Sum of Subarray ≤ K"
},
{
    id: 102,
    lcNumber: 127,
    title: "Word Ladder",
    difficulty: "Hard",
    category: "Graph BFS/DFS",
    description: "A transformation sequence from word `beginWord` to `endWord` using a dictionary `wordList` is a sequence where every adjacent pair of words differs by a single letter and every word in the sequence is in `wordList`. Return the number of words in the shortest transformation sequence, or 0 if no such sequence exists.",
    examples: [
        "Input: beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]\nOutput: 5\nExplanation: hit -> hot -> dot -> dog -> cog (5 words)",
        "Input: beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]\nOutput: 0"
    ],
    thinkingProcess: [
        { step: "Model as a graph problem", detail: "Each word is a node. Two words are connected if they differ by exactly one letter. We need the shortest path from `beginWord` to `endWord`. Shortest path in an unweighted graph → BFS." },
        { step: "Efficient neighbor finding", detail: "For each word, generate all possible one-letter mutations. For 'hot', try 'aot', 'bot', ..., 'hat', 'hbt', ..., 'hoa', 'hob', ... Check if each exists in the word set. This is O(26 × L) per word." },
        { step: "Optimize with wildcard patterns", detail: "Preprocess: for each word, create patterns like `h*t`, `*ot`, `ho*`. Map each pattern to all matching words. To find neighbors of 'hot', look up `*ot`, `h*t`, `ho*`. O(L) patterns per word." },
        { step: "Standard BFS", detail: "Start BFS from `beginWord`. For each word dequeued, generate neighbors. If we reach `endWord`, return the current depth. Mark words as visited to avoid cycles." },
        { step: "Bidirectional BFS optimization", detail: "For Google interviews, mention that bidirectional BFS (expanding from both ends simultaneously) reduces search space from O(b^d) to O(b^(d/2)). Always expand the smaller frontier." },
        { step: "Edge cases", detail: "If `endWord` is not in `wordList`, return 0 immediately. The count includes both `beginWord` and `endWord`." }
    ],
    keyInsight: "Model as a graph where words differing by one letter are neighbors. BFS gives shortest path. To efficiently find neighbors, use wildcard patterns (`h*t`) mapped to word lists during preprocessing.",
    approach: "1. Build pattern -> words mapping.\n2. BFS from `beginWord`, visiting neighbors via patterns.\n3. Track visited words. Return depth when `endWord` is found.",
    solutionPython: `from collections import defaultdict, deque

def ladderLength(beginWord, endWord, wordList):
    if endWord not in wordList:
        return 0
    
    L = len(beginWord)
    patterns = defaultdict(list)
    for word in wordList:
        for i in range(L):
            pattern = word[:i] + '*' + word[i+1:]
            patterns[pattern].append(word)
    
    queue = deque([(beginWord, 1)])
    visited = {beginWord}
    
    while queue:
        word, depth = queue.popleft()
        for i in range(L):
            pattern = word[:i] + '*' + word[i+1:]
            for neighbor in patterns[pattern]:
                if neighbor == endWord:
                    return depth + 1
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append((neighbor, depth + 1))
    
    return 0`,
    solutionCpp: `#include <unordered_set>
#include <vector>
#include <string>
#include <queue>
using namespace std;

int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
    unordered_set<string> wordSet(wordList.begin(), wordList.end());
    if (!wordSet.count(endWord)) return 0;
    
    queue<pair<string, int>> q;
    q.push({beginWord, 1});
    unordered_set<string> visited = {beginWord};
    
    while (!q.empty()) {
        auto [word, depth] = q.front(); q.pop();
        for (int i = 0; i < (int)word.size(); i++) {
            string temp = word;
            for (char c = 'a'; c <= 'z'; c++) {
                temp[i] = c;
                if (temp == endWord) return depth + 1;
                if (wordSet.count(temp) && !visited.count(temp)) {
                    visited.insert(temp);
                    q.push({temp, depth + 1});
                }
            }
        }
    }
    return 0;
}`,
    timeComplexity: "O(M² × N) where M = word length, N = list size",
    spaceComplexity: "O(M² × N)",
    patternGuide: "Use **BFS with state transformation** when:\n- Finding shortest transformation sequence\n- Each state transitions to neighbors by small changes\n- Unweighted graph / unit-cost edges\n\nSimilar: Word Ladder II, Minimum Genetic Mutation, Open the Lock"
},
{
    id: 103,
    lcNumber: 140,
    title: "Word Break II",
    difficulty: "Hard",
    category: "Backtracking",
    description: "Given a string `s` and a dictionary of strings `wordDict`, add spaces in `s` to construct a sentence where each word is a valid dictionary word. Return all such possible sentences in any order.",
    examples: [
        "Input: s = \"catsanddog\", wordDict = [\"cat\",\"cats\",\"and\",\"sand\",\"dog\"]\nOutput: [\"cats and dog\",\"cat sand dog\"]",
        "Input: s = \"pineapplepenapple\", wordDict = [\"apple\",\"pen\",\"applepen\",\"pine\",\"pineapple\"]\nOutput: [\"pine apple pen apple\",\"pineapple pen apple\",\"pine applepen apple\"]"
    ],
    thinkingProcess: [
        { step: "Recognize: backtracking with memoization", detail: "We need ALL valid sentences — not just true/false. Since we need all solutions, backtracking is the right framework. Memoize to avoid recomputing the same suffix." },
        { step: "Define the recursive structure", detail: "At position `i`, try every word in the dictionary that matches `s[i..i+len]`. If it matches, recursively solve the rest `s[i+len:]`. Base case: empty string returns `['']`." },
        { step: "Top-down with memoization", detail: "Cache: for each starting index `i`, store all valid sentences for `s[i:]`. Avoids recomputing shared suffixes." },
        { step: "Optimization with word set", detail: "Convert `wordDict` to a set for O(1) lookup. Track max word length to limit substring checks." },
        { step: "Contrast with Word Break I", detail: "Word Break I: true/false → DP. Word Break II: all solutions → backtracking + memo. Exponential output possible." },
        { step: "Build sentences on backtrack", detail: "Each recursive call returns a list of suffixes. Prepend the current word to each. Return the combined list." }
    ],
    keyInsight: "Backtracking with memoization. At each index, try all dictionary words matching the prefix. Recursively solve the remaining suffix and cache results. Naturally generates all valid decompositions while avoiding redundant computation.",
    approach: "1. Convert wordDict to a set.\n2. DFS from index 0, trying all matching words.\n3. Recursively solve remaining suffix.\n4. Memoize results per starting index.\n5. Combine current word with all suffix sentences.",
    solutionPython: `def wordBreak(s, wordDict):
    word_set = set(wordDict)
    memo = {}
    
    def backtrack(start):
        if start in memo:
            return memo[start]
        if start == len(s):
            return [""]
        
        sentences = []
        for end in range(start + 1, len(s) + 1):
            word = s[start:end]
            if word in word_set:
                rest = backtrack(end)
                for sentence in rest:
                    if sentence:
                        sentences.append(word + " " + sentence)
                    else:
                        sentences.append(word)
        
        memo[start] = sentences
        return sentences
    
    return backtrack(0)`,
    solutionCpp: `#include <vector>
#include <string>
#include <unordered_set>
#include <unordered_map>
using namespace std;

class Solution {
    unordered_set<string> dict;
    unordered_map<int, vector<string>> memo;
    
    vector<string> bt(const string& s, int start) {
        if (memo.count(start)) return memo[start];
        if (start == (int)s.size()) return {""};
        
        vector<string> result;
        for (int end = start + 1; end <= (int)s.size(); end++) {
            string word = s.substr(start, end - start);
            if (dict.count(word)) {
                for (auto& rest : bt(s, end))
                    result.push_back(rest.empty() ? word : word + " " + rest);
            }
        }
        return memo[start] = result;
    }
public:
    vector<string> wordBreak(string s, vector<string>& wordDict) {
        dict = {wordDict.begin(), wordDict.end()};
        return bt(s, 0);
    }
};`,
    timeComplexity: "O(n × 2^n) worst case",
    spaceComplexity: "O(n × 2^n)",
    patternGuide: "Use **backtracking + memoization** when:\n- Need ALL valid decompositions/combinations\n- Overlapping subproblems exist\n- Subproblems share suffixes/prefixes\n\nSimilar: Palindrome Partitioning, Concatenated Words"
},
{
    id: 104,
    lcNumber: 218,
    title: "The Skyline Problem",
    difficulty: "Hard",
    category: "Heap / Priority Queue",
    description: "A city's skyline is the outer contour formed by all buildings when viewed from a distance. Given buildings as triplets `[left, right, height]`, return the skyline as key points `[x, maxHeight]` sorted by x-coordinate.",
    examples: [
        "Input: buildings = [[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]\nOutput: [[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]",
        "Input: buildings = [[0,2,3],[2,5,3]]\nOutput: [[0,3],[5,0]]"
    ],
    thinkingProcess: [
        { step: "Understand skyline key points", detail: "A key point occurs wherever the maximum height changes — at the left edge (building starts, might increase max) or right edge (building ends, might decrease max)." },
        { step: "Create events", detail: "For each building `[l, r, h]`, create: `(l, -h)` for start (negative to sort starts before ends at same x, taller before shorter) and `(r, h)` for end. Sort all events." },
        { step: "Track active buildings with max-heap", detail: "Sweep left to right maintaining a max-heap of active building heights. At each event, add or remove heights. If max height changes, record a skyline point." },
        { step: "Handle removal challenge", detail: "Standard heaps don't support arbitrary removal. Use lazy deletion (mark removed, ignore when surfacing) in Python, or a multiset in C++." },
        { step: "Process events and detect changes", detail: "Sort events. For each x, process all events there. After processing, check if max height changed from previous. If so, record `[x, new_max]`." },
        { step: "Tie-breaking", detail: "Buildings with same left edge: process taller first. End and start at same x: process starts before ends. The negative-height trick handles both." }
    ],
    keyInsight: "Sweep line with a max-heap. Create start/end events for each building. Process events left-to-right, maintaining active building heights. Whenever the maximum height changes, that's a skyline key point.",
    approach: "1. Create events: `(left, -height)` for start, `(right, height)` for end.\n2. Sort events.\n3. Use max-heap/multiset to track active heights.\n4. Record key points where max height changes.",
    solutionPython: `import heapq

def getSkyline(buildings):
    events = []
    for l, r, h in buildings:
        events.append((l, -h, r))  # start
        events.append((r, 0, 0))   # end
    events.sort()
    
    heap = [(0, float('inf'))]  # (neg_height, right_edge)
    result = []
    prev_max = 0
    
    for x, neg_h, r in events:
        if neg_h != 0:
            heapq.heappush(heap, (neg_h, r))
        # Lazy deletion of expired buildings
        while heap[0][1] <= x:
            heapq.heappop(heap)
        
        curr_max = -heap[0][0]
        if curr_max != prev_max:
            result.append([x, curr_max])
            prev_max = curr_max
    
    return result`,
    solutionCpp: `#include <vector>
#include <set>
#include <algorithm>
using namespace std;

vector<vector<int>> getSkyline(vector<vector<int>>& buildings) {
    vector<pair<int,int>> events;
    for (auto& b : buildings) {
        events.push_back({b[0], -b[2]});
        events.push_back({b[1], b[2]});
    }
    sort(events.begin(), events.end());
    
    multiset<int> active = {0};
    vector<vector<int>> result;
    int prevMax = 0;
    
    for (auto& [x, h] : events) {
        if (h < 0) active.insert(-h);
        else active.erase(active.find(h));
        
        int currMax = *active.rbegin();
        if (currMax != prevMax) {
            result.push_back({x, currMax});
            prevMax = currMax;
        }
    }
    return result;
}`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    patternGuide: "Use **sweep line + heap/multiset** when:\n- Events at various x-coordinates affect a running aggregate\n- Track max/min over a changing set\n- Overlapping intervals at different heights\n\nSimilar: Meeting Rooms II, Falling Squares, Rectangle Area II"
},
{
    id: 105,
    lcNumber: 224,
    title: "Basic Calculator",
    difficulty: "Hard",
    category: "Stack",
    description: "Implement a basic calculator to evaluate a string expression with `+`, `-`, parentheses, spaces, and non-negative integers. Return the result of the evaluation.",
    examples: [
        "Input: s = \"1 + 1\"\nOutput: 2",
        "Input: s = \"(1+(4+5+2)-3)+(6+8)\"\nOutput: 23"
    ],
    thinkingProcess: [
        { step: "Only +, -, and parentheses", detail: "No * or /, so no operator precedence issue. The only complication is nested parentheses which can flip signs: `-(3+2)` means `-3 - 2`." },
        { step: "Track the sign context", detail: "Every number has an effective sign determined by enclosing parentheses. In `-(3-(2+1))`, the `2` has sign `- × - = +`. Use a stack to track cumulative sign." },
        { step: "Use stack for save/restore", detail: "Track `result` and `sign`. On `(`: push current result and sign, reset. On `)`: combine `result = saved_result + saved_sign × result`." },
        { step: "Process characters", detail: "Digit: build multi-digit number. `+`: add current num, set sign=+1. `-`: add current num, set sign=-1. `(`: push state, reset. `)`: finalize and restore." },
        { step: "Handle edge cases", detail: "Leading minus: `-1+2`. Multi-digit numbers. Spaces. Nested parens `((1+2))`." }
    ],
    keyInsight: "Stack to save/restore state at each parenthesis level. On `(`, push result and sign, then reset. On `)`, pop and combine: `result = saved_result + saved_sign × result`. Handles arbitrary nesting elegantly.",
    approach: "1. Iterate through characters, building numbers.\n2. On `+`/`-`: add number to result, update sign.\n3. On `(`: push state, reset.\n4. On `)`: pop and combine.\n5. Return final result.",
    solutionPython: `def calculate(s):
    stack = []
    result = 0
    num = 0
    sign = 1
    
    for ch in s:
        if ch.isdigit():
            num = num * 10 + int(ch)
        elif ch == '+':
            result += sign * num
            num = 0
            sign = 1
        elif ch == '-':
            result += sign * num
            num = 0
            sign = -1
        elif ch == '(':
            stack.append(result)
            stack.append(sign)
            result = 0
            sign = 1
        elif ch == ')':
            result += sign * num
            num = 0
            result *= stack.pop()  # sign before (
            result += stack.pop()  # result before (
    
    result += sign * num
    return result`,
    solutionCpp: `#include <string>
#include <stack>
using namespace std;

int calculate(string s) {
    stack<int> stk;
    int result = 0, num = 0, sign = 1;
    
    for (char ch : s) {
        if (isdigit(ch)) {
            num = num * 10 + (ch - '0');
        } else if (ch == '+') {
            result += sign * num;
            num = 0; sign = 1;
        } else if (ch == '-') {
            result += sign * num;
            num = 0; sign = -1;
        } else if (ch == '(') {
            stk.push(result);
            stk.push(sign);
            result = 0; sign = 1;
        } else if (ch == ')') {
            result += sign * num;
            num = 0;
            result *= stk.top(); stk.pop();
            result += stk.top(); stk.pop();
        }
    }
    return result + sign * num;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    patternGuide: "Use **stack for nested evaluation** when:\n- Expression has nested parentheses\n- Save/restore state at each nesting level\n- Running result modified by enclosing context\n\nSimilar: Basic Calculator II/III, Decode String, Number of Atoms"
},
{
    id: 106,
    lcNumber: 282,
    title: "Expression Add Operators",
    difficulty: "Hard",
    category: "Backtracking",
    description: "Given a string `num` that contains only digits and an integer `target`, return all possibilities to insert the binary operators `+`, `-`, and `*` between the digits so that the resultant expression evaluates to the `target` value. Operands should not contain leading zeroes.",
    examples: [
        "Input: num = \"123\", target = 6\nOutput: [\"1+2+3\",\"1*2*3\"]",
        "Input: num = \"232\", target = 8\nOutput: [\"2*3+2\",\"2+3*2\"]",
        "Input: num = \"3456237490\", target = 9191\nOutput: []"
    ],
    thinkingProcess: [
        { step: "Understand the structure", detail: "We need to insert `+`, `-`, or `*` between digits (or not — digits can form multi-digit numbers). This is a choice at each position: split here or extend the current number, and if splitting, which operator." },
        { step: "Why backtracking?", detail: "We need ALL valid expressions. The number of ways to partition n digits with 3 operators is exponential. Backtracking explores all possibilities and prunes invalid ones." },
        { step: "The multiplication challenge", detail: "With only `+` and `-`, we could maintain a running sum. But `*` has higher precedence: `2+3*2 = 8`, not `10`. We need to undo the last addition/subtraction and reapply it with multiplication." },
        { step: "Track the 'last operand'", detail: "Keep track of `prev` — the last operand added/subtracted. For `*`: undo prev from result (`result - prev`), then apply `prev * current` and add it back. This correctly handles precedence without parsing." },
        { step: "Handle multi-digit numbers", detail: "At each position, try taking 1 digit, 2 digits, 3 digits, etc. Skip numbers with leading zeros (except `0` itself). This means the loop tries substrings of increasing length." },
        { step: "Recursive structure", detail: "Parameters: `index` (current position in string), `result` (current evaluation), `prev` (last operand for undo), `expr` (expression string built so far). At each step, try all split points with all three operators." }
    ],
    keyInsight: "Backtrack through all ways to split the digit string and insert operators. The key trick for handling `*` precedence: track the last operand (`prev`). To apply `*`, undo `prev` from result, then add `prev * current`. This avoids needing a full expression parser.",
    approach: "1. Backtrack from index 0.\n2. At each step, try substrings of length 1, 2, ..., n-index.\n3. Skip leading zeros.\n4. Try `+`, `-`, `*` (first number has no operator).\n5. For `*`: `result = result - prev + prev * num`.\n6. Collect expressions that equal target.",
    solutionPython: `def addOperators(num, target):
    result = []
    
    def backtrack(idx, expr, total, prev):
        if idx == len(num):
            if total == target:
                result.append(expr)
            return
        
        for i in range(idx, len(num)):
            # Skip leading zeros
            if i > idx and num[idx] == '0':
                break
            
            cur = int(num[idx:i+1])
            
            if idx == 0:
                # First number, no operator
                backtrack(i + 1, str(cur), cur, cur)
            else:
                # Try +
                backtrack(i + 1, expr + '+' + str(cur),
                         total + cur, cur)
                # Try -
                backtrack(i + 1, expr + '-' + str(cur),
                         total - cur, -cur)
                # Try * (undo prev, apply prev * cur)
                backtrack(i + 1, expr + '*' + str(cur),
                         total - prev + prev * cur, prev * cur)
    
    backtrack(0, "", 0, 0)
    return result`,
    solutionCpp: `#include <vector>
#include <string>
using namespace std;

class Solution {
    vector<string> result;
    
    void bt(const string& num, int target, int idx,
            string expr, long total, long prev) {
        if (idx == (int)num.size()) {
            if (total == target) result.push_back(expr);
            return;
        }
        for (int i = idx; i < (int)num.size(); i++) {
            if (i > idx && num[idx] == '0') break;
            string s = num.substr(idx, i - idx + 1);
            long cur = stol(s);
            
            if (idx == 0) {
                bt(num, target, i + 1, s, cur, cur);
            } else {
                bt(num, target, i+1, expr+"+"+s, total+cur, cur);
                bt(num, target, i+1, expr+"-"+s, total-cur, -cur);
                bt(num, target, i+1, expr+"*"+s,
                   total-prev+prev*cur, prev*cur);
            }
        }
    }
public:
    vector<string> addOperators(string num, int target) {
        bt(num, target, 0, "", 0, 0);
        return result;
    }
};`,
    timeComplexity: "O(4^n × n)",
    spaceComplexity: "O(n) recursion depth",
    patternGuide: "Use **backtracking with precedence tracking** when:\n- Inserting operators into a sequence\n- Need to handle operator precedence without parsing\n- Track the last operand to 'undo' for multiplication\n\nSimilar: Different Ways to Add Parentheses, Target Sum"
},
{
    id: 107,
    lcNumber: 301,
    title: "Remove Invalid Parentheses",
    difficulty: "Hard",
    category: "Backtracking",
    description: "Given a string `s` that contains parentheses and letters, remove the minimum number of invalid parentheses to make the input string valid. Return a list of unique strings that are valid with the minimum number of removals.",
    examples: [
        "Input: s = \"()())()\"\nOutput: [\"(())()\",\"()()()\"]",
        "Input: s = \"(a)())()\"\nOutput: [\"(a())()\",\"(a)()()\"]",
        "Input: s = \")(\"\nOutput: [\"\"]"
    ],
    thinkingProcess: [
        { step: "Calculate minimum removals", detail: "First, figure out how many `(` and `)` to remove. Scan left to right: track unmatched `(` (open count) and unmatched `)` (close count). These are the minimum removals needed." },
        { step: "Why BFS approach works", detail: "BFS by removal count: level 0 = original string, level 1 = all strings with 1 char removed, etc. The first level that produces valid strings gives minimum removals. But this is O(2^n)." },
        { step: "Smarter backtracking", detail: "Since we know exactly how many `(` and `)` to remove (from step 1), we can backtrack: at each character, choose to keep or remove it. Only remove if it's a parenthesis and we still have removals left for that type." },
        { step: "Avoid duplicates", detail: "Key optimization: if we have consecutive same characters like `)))`, removing any one gives the same result. So only remove the first one in a consecutive group. This prunes the search tree dramatically." },
        { step: "Validity check", detail: "Track open count during recursion. If it goes negative, we've placed too many `)` — prune. At the end, open count must be exactly 0." },
        { step: "Pruning conditions", detail: "Prune if: (1) open count < 0 (invalid prefix), (2) remaining removals of `(` or `)` go negative, (3) not enough characters left to use remaining removals." }
    ],
    keyInsight: "First compute exactly how many `(` and `)` need removal. Then backtrack: at each char, try keeping or removing it. Skip consecutive duplicates to avoid duplicate results. Track running balance to prune invalid prefixes early.",
    approach: "1. Count minimum `(` and `)` removals needed.\n2. Backtrack through string: keep or remove each parenthesis.\n3. Skip consecutive duplicates.\n4. Prune when balance goes negative or removal counts exceed budget.\n5. Collect valid strings.",
    solutionPython: `def removeInvalidParentheses(s):
    # Count minimum removals needed
    rem_open = rem_close = 0
    for ch in s:
        if ch == '(':
            rem_open += 1
        elif ch == ')':
            if rem_open > 0:
                rem_open -= 1
            else:
                rem_close += 1
    
    result = set()
    
    def backtrack(idx, open_count, ro, rc, path):
        if idx == len(s):
            if open_count == 0 and ro == 0 and rc == 0:
                result.add(path)
            return
        
        ch = s[idx]
        
        if ch == '(':
            # Option 1: remove it (if we still can)
            if ro > 0:
                backtrack(idx + 1, open_count, ro - 1, rc, path)
            # Option 2: keep it
            backtrack(idx + 1, open_count + 1, ro, rc, path + ch)
        elif ch == ')':
            # Option 1: remove it
            if rc > 0:
                backtrack(idx + 1, open_count, ro, rc - 1, path)
            # Option 2: keep it (only if valid)
            if open_count > 0:
                backtrack(idx + 1, open_count - 1, ro, rc, path + ch)
        else:
            # Letter — always keep
            backtrack(idx + 1, open_count, ro, rc, path + ch)
    
    backtrack(0, 0, rem_open, rem_close, "")
    return list(result)`,
    solutionCpp: `#include <vector>
#include <string>
#include <unordered_set>
using namespace std;

class Solution {
    unordered_set<string> res;
    
    void bt(const string& s, int idx, int open, int ro, int rc, string path) {
        if (idx == (int)s.size()) {
            if (open == 0 && ro == 0 && rc == 0)
                res.insert(path);
            return;
        }
        char ch = s[idx];
        if (ch == '(') {
            if (ro > 0) bt(s, idx+1, open, ro-1, rc, path);
            bt(s, idx+1, open+1, ro, rc, path + ch);
        } else if (ch == ')') {
            if (rc > 0) bt(s, idx+1, open, ro, rc-1, path);
            if (open > 0) bt(s, idx+1, open-1, ro, rc, path + ch);
        } else {
            bt(s, idx+1, open, ro, rc, path + ch);
        }
    }
public:
    vector<string> removeInvalidParentheses(string s) {
        int ro = 0, rc = 0;
        for (char c : s) {
            if (c == '(') ro++;
            else if (c == ')') { if (ro > 0) ro--; else rc++; }
        }
        bt(s, 0, 0, ro, rc, "");
        return vector<string>(res.begin(), res.end());
    }
};`,
    timeComplexity: "O(2^n) worst case",
    spaceComplexity: "O(n) recursion depth",
    patternGuide: "Use **count-first then prune backtracking** when:\n- Need minimum removals to achieve validity\n- Knowing the exact removal budget enables pruning\n- Duplicate avoidance is critical\n\nSimilar: Valid Parentheses, Minimum Add to Make Parentheses Valid"
},
{
    id: 108,
    lcNumber: 315,
    title: "Count of Smaller Numbers After Self",
    difficulty: "Hard",
    category: "Trees",
    description: "Given an integer array `nums`, return an integer array `counts` where `counts[i]` is the number of smaller elements to the right of `nums[i]`.",
    examples: [
        "Input: nums = [5,2,6,1]\nOutput: [2,1,1,0]\nExplanation: For 5 there are 2 smaller after (2,1). For 2 there is 1 (1). For 6 there is 1 (1). For 1 there are 0.",
        "Input: nums = [-1,-1]\nOutput: [0,0]"
    ],
    thinkingProcess: [
        { step: "Brute force", detail: "For each element, count smaller elements to its right. O(n²). Can we do better?" },
        { step: "Think about merge sort", detail: "During merge sort, when we merge two halves, elements from the right half that come before elements of the left half are exactly the 'smaller elements after self'. We can count these during the merge step." },
        { step: "Modified merge sort", detail: "Sort indices (not values directly) to track original positions. During merge, when a right-half element is placed before a left-half element, it means that right element is smaller and was originally to the right. Count these inversions." },
        { step: "Counting during merge", detail: "When merging left[i] and right[j]: if `left[i] > right[j]`, place right[j] first and increment a counter. When we finally place left[i], the counter tells us how many right-half elements were smaller. Add this to `counts[original_index_of_left[i]]`." },
        { step: "Alternative: BIT / Fenwick Tree", detail: "Process from right to left. For each element, query BIT for count of elements < current (already inserted). Then insert current element. Coordinate compress values first. Also O(n log n)." },
        { step: "Choose merge sort for interviews", detail: "Merge sort approach is elegant and demonstrates deep understanding of divide-and-conquer. It naturally counts inversions. The BIT approach is more mechanical but equally valid." }
    ],
    keyInsight: "Modified merge sort: during the merge step, when a right-half element is placed before a left-half element, it contributes to the count. Track original indices and accumulate counts as the merge proceeds. This is essentially counting split inversions.",
    approach: "1. Create array of (value, original_index) pairs.\n2. Merge sort this array.\n3. During merge, when right element < left element, all remaining left elements have one more smaller-after.\n4. Track counts per original index.",
    solutionPython: `def countSmaller(nums):
    n = len(nums)
    counts = [0] * n
    indices = list(range(n))
    
    def merge_sort(arr):
        if len(arr) <= 1:
            return arr
        mid = len(arr) // 2
        left = merge_sort(arr[:mid])
        right = merge_sort(arr[mid:])
        
        result = []
        j = 0
        for i in range(len(left)):
            # Count right elements smaller than left[i]
            while j < len(right) and nums[right[j]] < nums[left[i]]:
                result.append(right[j])
                j += 1
            counts[left[i]] += j
            result.append(left[i])
        
        result.extend(right[j:])
        return result
    
    merge_sort(indices)
    return counts`,
    solutionCpp: `#include <vector>
using namespace std;

class Solution {
    vector<int> counts;
    
    void mergeSort(vector<pair<int,int>>& arr, int l, int r) {
        if (r - l <= 1) return;
        int mid = (l + r) / 2;
        mergeSort(arr, l, mid);
        mergeSort(arr, mid, r);
        
        vector<pair<int,int>> temp;
        int i = l, j = mid;
        while (i < mid && j < r) {
            if (arr[j].first < arr[i].first) {
                temp.push_back(arr[j++]);
            } else {
                counts[arr[i].second] += (j - mid);
                temp.push_back(arr[i++]);
            }
        }
        while (i < mid) {
            counts[arr[i].second] += (j - mid);
            temp.push_back(arr[i++]);
        }
        while (j < r) temp.push_back(arr[j++]);
        copy(temp.begin(), temp.end(), arr.begin() + l);
    }
public:
    vector<int> countSmaller(vector<int>& nums) {
        int n = nums.size();
        counts.assign(n, 0);
        vector<pair<int,int>> arr(n);
        for (int i = 0; i < n; i++) arr[i] = {nums[i], i};
        mergeSort(arr, 0, n);
        return counts;
    }
};`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    patternGuide: "Use **modified merge sort** when:\n- Counting inversions or relative orderings\n- Need count of elements satisfying a condition across a split\n- Problems reducible to inversion counting\n\nSimilar: Reverse Pairs, Count Range Sum, Global and Local Inversions"
},
{
    id: 109,
    lcNumber: 340,
    title: "Longest Substring with At Most K Distinct Characters",
    difficulty: "Hard",
    category: "Sliding Window",
    description: "Given a string `s` and an integer `k`, return the length of the longest substring of `s` that contains at most `k` distinct characters.",
    examples: [
        "Input: s = \"eceba\", k = 2\nOutput: 3\nExplanation: The substring is \"ece\" with length 3.",
        "Input: s = \"aa\", k = 1\nOutput: 2"
    ],
    thinkingProcess: [
        { step: "Recognize the sliding window pattern", detail: "We want the longest substring with a constraint (at most k distinct chars). This is a classic variable-size sliding window: expand right to include more chars, shrink left when constraint is violated." },
        { step: "What to track in the window", detail: "A hashmap counting character frequencies in the current window. The number of distinct characters = number of keys in the map." },
        { step: "Expand right", detail: "Add `s[right]` to the frequency map. If the number of distinct chars ≤ k, update max length." },
        { step: "Shrink left when violated", detail: "If distinct chars > k, shrink from the left: decrement `s[left]` count, remove from map if count hits 0, advance left. Repeat until we have ≤ k distinct chars." },
        { step: "Optimization: OrderedDict for O(1) eviction", detail: "Instead of shrinking one by one, use an OrderedDict to track the rightmost index of each character. When we need to evict, remove the char with the smallest rightmost index (the leftmost 'last-seen'). Move left pointer past it." },
        { step: "Why this works", detail: "The window only expands or stays the same size (never shrinks past a valid answer). Each character is added and removed at most once. Total: O(n)." }
    ],
    keyInsight: "Classic sliding window: expand right pointer, track distinct chars in a frequency map. When distinct count exceeds k, shrink left until the constraint is restored. Each character is processed at most twice (added and removed), giving O(n) time.",
    approach: "1. Two pointers `left=0`, `right=0`.\n2. Frequency map for chars in window.\n3. Expand right, adding chars.\n4. If distinct > k, shrink left until distinct ≤ k.\n5. Update max length at each valid state.",
    solutionPython: `def lengthOfLongestSubstringKDistinct(s, k):
    if k == 0:
        return 0
    
    freq = {}
    left = 0
    max_len = 0
    
    for right in range(len(s)):
        freq[s[right]] = freq.get(s[right], 0) + 1
        
        while len(freq) > k:
            freq[s[left]] -= 1
            if freq[s[left]] == 0:
                del freq[s[left]]
            left += 1
        
        max_len = max(max_len, right - left + 1)
    
    return max_len`,
    solutionCpp: `#include <string>
#include <unordered_map>
using namespace std;

int lengthOfLongestSubstringKDistinct(string s, int k) {
    if (k == 0) return 0;
    
    unordered_map<char, int> freq;
    int left = 0, maxLen = 0;
    
    for (int right = 0; right < (int)s.size(); right++) {
        freq[s[right]]++;
        
        while ((int)freq.size() > k) {
            if (--freq[s[left]] == 0)
                freq.erase(s[left]);
            left++;
        }
        
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(k)",
    patternGuide: "Use **variable-size sliding window with hashmap** when:\n- Finding longest/shortest substring with a constraint on distinct elements\n- Constraint can be checked/maintained incrementally\n- Window validity depends on aggregate property (count of distinct, sum, etc.)\n\nSimilar: Longest Substring Without Repeating Characters, Minimum Window Substring, Subarrays with K Different Integers"
},
{
    id: 110,
    lcNumber: 410,
    title: "Split Array Largest Sum",
    difficulty: "Hard",
    category: "Binary Search",
    description: "Given an integer array `nums` and an integer `k`, split `nums` into `k` non-empty subarrays such that the largest sum of any subarray is minimized. Return the minimized largest sum.",
    examples: [
        "Input: nums = [7,2,5,10,8], k = 2\nOutput: 18\nExplanation: Split into [7,2,5] and [10,8]. The largest sum is 18. This is the minimum possible.",
        "Input: nums = [1,2,3,4,5], k = 2\nOutput: 9"
    ],
    thinkingProcess: [
        { step: "Understand the search space", detail: "The answer (largest subarray sum) is between `max(nums)` (each element alone, the minimum possible max) and `sum(nums)` (everything in one group, the maximum possible max). We need to find the optimal value in this range." },
        { step: "Binary search on the answer", detail: "Instead of trying all partitions, binary search on the answer! For a candidate `mid`, ask: 'Can we split the array into ≤ k subarrays where each sum ≤ mid?' If yes, try smaller. If no, try larger." },
        { step: "Greedy feasibility check", detail: "To check if `mid` is feasible: greedily fill subarrays. Start a new subarray. Add elements one by one. When adding an element would exceed `mid`, start a new subarray. Count subarrays needed. If count ≤ k, it's feasible." },
        { step: "Why greedy works for the check", detail: "Greedy packing (make each subarray as full as possible without exceeding `mid`) minimizes the number of subarrays. If even greedy needs > k subarrays, no strategy can do it in ≤ k." },
        { step: "Binary search details", detail: "lo = max(nums), hi = sum(nums). While lo < hi: mid = (lo+hi)//2. If feasible(mid): hi = mid. Else: lo = mid + 1. Return lo." },
        { step: "Complexity", detail: "Binary search: O(log(sum - max)) iterations. Each check: O(n). Total: O(n × log(sum)). Much better than trying all partitions." }
    ],
    keyInsight: "Binary search on the answer. The answer lies between `max(nums)` and `sum(nums)`. For each candidate value, greedily check if we can split the array into ≤ k groups each with sum ≤ that value. This transforms an optimization problem into a binary search + greedy feasibility check.",
    approach: "1. Binary search on answer: lo = max(nums), hi = sum(nums).\n2. For each mid, greedily check feasibility.\n3. Greedy: accumulate sums, start new group when exceeding mid.\n4. If groups ≤ k → feasible, try smaller. Else try larger.",
    solutionPython: `def splitArray(nums, k):
    def can_split(max_sum):
        groups = 1
        current = 0
        for num in nums:
            if current + num > max_sum:
                groups += 1
                current = num
            else:
                current += num
        return groups <= k
    
    lo, hi = max(nums), sum(nums)
    while lo < hi:
        mid = (lo + hi) // 2
        if can_split(mid):
            hi = mid
        else:
            lo = mid + 1
    
    return lo`,
    solutionCpp: `#include <vector>
#include <numeric>
#include <algorithm>
using namespace std;

int splitArray(vector<int>& nums, int k) {
    auto canSplit = [&](long long maxSum) {
        int groups = 1;
        long long cur = 0;
        for (int num : nums) {
            if (cur + num > maxSum) {
                groups++;
                cur = num;
            } else {
                cur += num;
            }
        }
        return groups <= k;
    };
    
    long long lo = *max_element(nums.begin(), nums.end());
    long long hi = accumulate(nums.begin(), nums.end(), 0LL);
    
    while (lo < hi) {
        long long mid = lo + (hi - lo) / 2;
        if (canSplit(mid)) hi = mid;
        else lo = mid + 1;
    }
    return (int)lo;
}`,
    timeComplexity: "O(n × log(sum))",
    spaceComplexity: "O(1)",
    patternGuide: "Use **binary search on the answer** when:\n- You're minimizing a maximum or maximizing a minimum\n- The answer lies in a bounded range\n- Feasibility can be checked greedily in O(n)\n\nSimilar: Koko Eating Bananas, Capacity To Ship Packages, Magnetic Force Between Two Balls"
},
{
    id: 111,
    lcNumber: 465,
    title: "Optimal Account Balancing",
    difficulty: "Hard",
    category: "Backtracking",
    description: "You are given an array of transactions where `transactions[i] = [from_i, to_i, amount_i]` indicates that person `from_i` gave `amount_i` to person `to_i`. Return the minimum number of transactions required to settle all debts.",
    examples: [
        "Input: transactions = [[0,1,10],[2,0,5]]\nOutput: 2\nExplanation: Person 0 gives person 1 $10. Person 2 gives person 0 $5. Two ways to settle: 0→1 $5 and 2→1 $5, or 0→1 $10 and 2→0 $5. Minimum is 2.",
        "Input: transactions = [[0,1,10],[1,0,1],[1,2,5],[2,0,5]]\nOutput: 1\nExplanation: Net: 0 owes 4, 1 owes 4, 2 is owed 0... wait — 0:-4, 1:+4. One transfer: 0→1 $4."
    ],
    thinkingProcess: [
        { step: "Compute net balances", detail: "First, compute each person's net balance. Positive = they're owed money, negative = they owe money. People with zero balance are irrelevant. We only care about non-zero balances." },
        { step: "Reduce to: settle non-zero debts with minimum transfers", detail: "We have a set of positive and negative balances that sum to zero. We need to make them all zero using minimum pairwise transfers. Each transfer zeroes out at least one balance (optimally two)." },
        { step: "Why greedy doesn't work", detail: "Matching the largest debtor with the largest creditor seems intuitive but doesn't always minimize transfers. Example: debts [-5, -5, 10] vs [-5, -3, -2, 10]. The structure matters." },
        { step: "Backtracking approach", detail: "Try settling the first non-zero balance with each subsequent non-zero balance (of opposite sign). For each choice, recursively settle the remaining balances. Take the minimum." },
        { step: "Key optimization", detail: "When `debt[i] + debt[j] == 0` (perfect match), always take it — it settles two people in one transfer, which is optimal. No need to explore other options for a perfect match." },
        { step: "Complexity", detail: "In the worst case, this is exponential. But debts are typically small (≤ 8 non-zero), so backtracking with pruning is fast enough. The NP-hard nature of the general problem means no polynomial algorithm exists." }
    ],
    keyInsight: "Compute net balances, then use backtracking to find the minimum transfers to zero out all balances. For the first unsettled debt, try pairing it with each opposite-sign debt. If a perfect match exists (sum=0), take it immediately. This NP-hard problem is tractable for small inputs with pruning.",
    approach: "1. Compute net balance for each person.\n2. Filter out zero balances.\n3. Backtrack: find first non-zero balance, try settling with each subsequent opposite-sign balance.\n4. Recurse on remaining balances.\n5. Optimization: take perfect matches immediately.",
    solutionPython: `def minTransfers(transactions):
    from collections import defaultdict
    
    balance = defaultdict(int)
    for f, t, amount in transactions:
        balance[f] -= amount
        balance[t] += amount
    
    debts = [v for v in balance.values() if v != 0]
    
    def backtrack(start):
        # Skip settled debts
        while start < len(debts) and debts[start] == 0:
            start += 1
        if start == len(debts):
            return 0
        
        min_trans = float('inf')
        for i in range(start + 1, len(debts)):
            # Only pair opposite signs
            if debts[start] * debts[i] < 0:
                debts[i] += debts[start]
                min_trans = min(min_trans, 1 + backtrack(start + 1))
                debts[i] -= debts[start]
                
                # Perfect match optimization
                if debts[i] + debts[start] == 0:
                    break
        
        return min_trans
    
    return backtrack(0)`,
    solutionCpp: `#include <vector>
#include <unordered_map>
#include <climits>
using namespace std;

int minTransfers(vector<vector<int>>& transactions) {
    unordered_map<int, int> bal;
    for (auto& t : transactions) {
        bal[t[0]] -= t[2];
        bal[t[1]] += t[2];
    }
    
    vector<int> debts;
    for (auto& [_, v] : bal)
        if (v != 0) debts.push_back(v);
    
    function<int(int)> bt = [&](int start) -> int {
        while (start < (int)debts.size() && debts[start] == 0) start++;
        if (start == (int)debts.size()) return 0;
        
        int res = INT_MAX;
        for (int i = start + 1; i < (int)debts.size(); i++) {
            if ((long)debts[start] * debts[i] < 0) {
                debts[i] += debts[start];
                res = min(res, 1 + bt(start + 1));
                debts[i] -= debts[start];
                if (debts[i] == 0) break; // perfect match
            }
        }
        return res;
    };
    
    return bt(0);
}`,
    timeComplexity: "O(n!) worst case, but heavily pruned",
    spaceComplexity: "O(n)",
    patternGuide: "Use **backtracking with pairing** when:\n- NP-hard optimization on small inputs\n- Matching elements from two groups optimally\n- Perfect-match pruning significantly reduces search space\n\nSimilar: Partition to K Equal Sum Subsets, Matchsticks to Square"
},
{
    id: 112,
    lcNumber: 489,
    title: "Robot Room Cleaner",
    difficulty: "Hard",
    category: "Graph BFS/DFS",
    description: "You have a robot cleaner in a room modeled as a grid. The robot has an API: `move()` (returns true if moved forward), `turnLeft()`, `turnRight()`, and `clean()`. The robot starts at an unknown position facing up. You cannot access the grid directly. Write an algorithm to clean the entire room.",
    examples: [
        "Input: room = [[1,1,1,1],[1,1,0,1],[1,1,1,1]], row = 1, col = 3\nOutput: Robot cleans all accessible cells\nExplanation: 1 = open, 0 = wall. Robot starts at (1,3) and must navigate and clean all 1-cells."
    ],
    thinkingProcess: [
        { step: "No grid access — explore like a real robot", detail: "We can't see the grid. We can only move, turn, and clean. This is like exploring an unknown maze. DFS is the natural approach: go as far as possible, then backtrack." },
        { step: "Track visited cells", detail: "We need to track which cells we've cleaned to avoid infinite loops. But we don't know absolute coordinates! Solution: use RELATIVE coordinates from the starting position. Start at (0,0), track direction changes." },
        { step: "Direction management", detail: "The robot faces up initially. Define 4 directions: up(-1,0), right(0,1), down(1,0), left(0,-1). When we turn right, direction index increases by 1 (mod 4). Track current direction throughout." },
        { step: "DFS with backtracking", detail: "At each cell: (1) clean it, (2) mark as visited, (3) try all 4 directions. For each direction: turn to face it, if the cell is unvisited and `move()` succeeds, recurse. After exploring, BACKTRACK: turn 180° and move back." },
        { step: "Backtracking is physical", detail: "Unlike normal DFS where we just pop the stack, here we must physically move the robot back. After exploring a direction, turn around (two right turns), move forward, turn around again to restore original facing." },
        { step: "The spiral pattern", detail: "The robot tries each direction in order (up, right, down, left), turning right between each. After trying all 4 from a cell, it backtracks to the previous cell. This naturally creates a spiral-like exploration." }
    ],
    keyInsight: "DFS with relative coordinate tracking. Clean current cell, mark visited using relative (row,col) from start. Try all 4 directions: turn, attempt move, recurse if successful. Backtrack physically by turning 180° and moving back. This explores every reachable cell exactly once.",
    approach: "1. Track relative position and direction.\n2. At each cell: clean, mark visited.\n3. For each of 4 directions: turn to face it, try to move.\n4. If move succeeds and cell unvisited: recurse.\n5. Backtrack: turn 180°, move, turn 180°.",
    solutionPython: `def cleanRoom(robot):
    visited = set()
    # Directions: up, right, down, left
    directions = [(-1, 0), (0, 1), (1, 0), (0, -1)]
    
    def backtrack(row, col, d):
        visited.add((row, col))
        robot.clean()
        
        # Try all 4 directions
        for i in range(4):
            new_d = (d + i) % 4
            new_row = row + directions[new_d][0]
            new_col = col + directions[new_d][1]
            
            if (new_row, new_col) not in visited and robot.move():
                backtrack(new_row, new_col, new_d)
                # Backtrack: turn around, move back, turn around
                robot.turnRight()
                robot.turnRight()
                robot.move()
                robot.turnRight()
                robot.turnRight()
            
            # Turn to next direction
            robot.turnRight()
    
    backtrack(0, 0, 0)`,
    solutionCpp: `class Solution {
    unordered_set<string> visited;
    int dirs[4][2] = {{-1,0},{0,1},{1,0},{0,-1}};
    
    void goBack(Robot& robot) {
        robot.turnRight();
        robot.turnRight();
        robot.move();
        robot.turnRight();
        robot.turnRight();
    }
    
    void dfs(Robot& robot, int r, int c, int d) {
        visited.insert(to_string(r) + "," + to_string(c));
        robot.clean();
        
        for (int i = 0; i < 4; i++) {
            int nd = (d + i) % 4;
            int nr = r + dirs[nd][0], nc = c + dirs[nd][1];
            string key = to_string(nr) + "," + to_string(nc);
            
            if (!visited.count(key) && robot.move()) {
                dfs(robot, nr, nc, nd);
                goBack(robot);
            }
            robot.turnRight();
        }
    }
public:
    void cleanRoom(Robot& robot) {
        dfs(robot, 0, 0, 0);
    }
};`,
    timeComplexity: "O(N - M) where N = cells, M = obstacles",
    spaceComplexity: "O(N - M)",
    patternGuide: "Use **DFS with physical backtracking** when:\n- Exploring unknown environments without global state\n- Robot/agent can only sense locally\n- Must physically return to previous position after exploring\n\nSimilar: Maze problems, Flood Fill variants"
},
{
    id: 113,
    lcNumber: 552,
    title: "Student Attendance Record II",
    difficulty: "Hard",
    category: "Dynamic Programming",
    description: "A student's attendance record is a string of characters: `A` (absent), `L` (late), `P` (present). A record is rewardable if it has strictly fewer than 2 `A`s AND no 3+ consecutive `L`s. Given `n`, return the number of rewardable records of length `n`. Return the answer modulo 10^9 + 7.",
    examples: [
        "Input: n = 2\nOutput: 8\nExplanation: Records: PP, PL, LP, LL, AP, PA, AL, LA. All 8 are rewardable.",
        "Input: n = 1\nOutput: 3",
        "Input: n = 10101\nOutput: 183236316"
    ],
    thinkingProcess: [
        { step: "Identify state variables", detail: "To determine if a record is valid, we need: (1) how many A's so far (0 or 1), and (2) how many consecutive L's at the end (0, 1, or 2). This gives us the DP state." },
        { step: "Define the DP", detail: "`dp[i][a][l]` = number of valid records of length `i` with exactly `a` total absences and `l` consecutive L's at the end. `a` ∈ {0,1}, `l` ∈ {0,1,2}. So 6 states per position." },
        { step: "Transitions", detail: "From state `(a, l)`, we can append:\n- `P`: new state `(a, 0)` — consecutive L's reset\n- `L`: new state `(a, l+1)` — only if `l+1 ≤ 2`\n- `A`: new state `(a+1, 0)` — only if `a+1 ≤ 1`" },
        { step: "Base case and answer", detail: "Base: `dp[0][0][0] = 1` (empty record). Answer: sum of all `dp[n][a][l]` for valid `a` and `l`." },
        { step: "Optimize space", detail: "We only need the previous row. Reduce from O(n) space to O(1) by keeping only 6 variables: `dp[a][l]` for the current and previous step." },
        { step: "Matrix exponentiation for large n", detail: "Since there are only 6 states with linear transitions, we can model this as matrix multiplication. Use matrix exponentiation to compute in O(log n) time. Not required for interviews but good to mention." }
    ],
    keyInsight: "DP with state (total_absences, consecutive_late_at_end). Only 6 states: absences ∈ {0,1} × consecutive_late ∈ {0,1,2}. At each position, try appending P, L, or A and transition between states. O(n) time with O(1) space.",
    approach: "1. Define `dp[a][l]` = count of valid records ending with `a` total absences, `l` trailing L's.\n2. For each position, compute new states from P, L, A transitions.\n3. Sum all valid states after n positions.\n4. Use modular arithmetic throughout.",
    solutionPython: `def checkRecord(n):
    MOD = 10**9 + 7
    # dp[a][l] = count with a absences, l trailing L's
    dp = [[0] * 3 for _ in range(2)]
    dp[0][0] = 1  # base: empty record
    
    for _ in range(n):
        new_dp = [[0] * 3 for _ in range(2)]
        for a in range(2):
            for l in range(3):
                if dp[a][l] == 0:
                    continue
                # Append P: resets L streak
                new_dp[a][0] = (new_dp[a][0] + dp[a][l]) % MOD
                # Append L: extends L streak (if < 2)
                if l + 1 < 3:
                    new_dp[a][l+1] = (new_dp[a][l+1] + dp[a][l]) % MOD
                # Append A: resets L, adds absence (if < 1)
                if a + 1 < 2:
                    new_dp[a+1][0] = (new_dp[a+1][0] + dp[a][l]) % MOD
        dp = new_dp
    
    total = 0
    for a in range(2):
        for l in range(3):
            total = (total + dp[a][l]) % MOD
    return total`,
    solutionCpp: `#include <cstring>
using namespace std;

int checkRecord(int n) {
    const int MOD = 1e9 + 7;
    // dp[a][l]
    long long dp[2][3] = {};
    dp[0][0] = 1;
    
    for (int i = 0; i < n; i++) {
        long long ndp[2][3] = {};
        for (int a = 0; a < 2; a++) {
            for (int l = 0; l < 3; l++) {
                if (!dp[a][l]) continue;
                // P
                ndp[a][0] = (ndp[a][0] + dp[a][l]) % MOD;
                // L
                if (l + 1 < 3)
                    ndp[a][l+1] = (ndp[a][l+1] + dp[a][l]) % MOD;
                // A
                if (a + 1 < 2)
                    ndp[a+1][0] = (ndp[a+1][0] + dp[a][l]) % MOD;
            }
        }
        memcpy(dp, ndp, sizeof(dp));
    }
    
    long long total = 0;
    for (int a = 0; a < 2; a++)
        for (int l = 0; l < 3; l++)
            total = (total + dp[a][l]) % MOD;
    return (int)total;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1) — only 6 state variables",
    patternGuide: "Use **finite-state DP** when:\n- The problem has a small number of states (constraints on counts, streaks)\n- Each position makes a choice that transitions between states\n- Counting valid sequences with constraints\n\nSimilar: Paint House, Domino and Tromino Tiling, Knight Dialer"
},
{
    id: 114,
    lcNumber: 630,
    title: "Course Schedule III",
    difficulty: "Hard",
    category: "Greedy",
    description: "There are `n` courses with `duration[i]` and `lastDay[i]` (deadline). Starting from day 1, you can only take one course at a time and must finish it before or on its deadline. Return the maximum number of courses you can take.",
    examples: [
        "Input: courses = [[100,200],[200,1300],[1000,1250],[2000,3200]]\nOutput: 3\nExplanation: Take course 1 (day 1-100), course 3 (day 101-1100), course 2 (day 1101-1300). Can't fit course 4.",
        "Input: courses = [[1,2]]\nOutput: 1"
    ],
    thinkingProcess: [
        { step: "Sort by deadline", detail: "Consider courses in order of their deadline. A course with an earlier deadline should be considered first — if we skip it now, we might not be able to take it later." },
        { step: "Greedy: take if possible", detail: "Process courses in deadline order. If we can finish the current course by its deadline (current_time + duration ≤ lastDay), take it. Add duration to current_time." },
        { step: "What if we can't fit it?", detail: "If the current course doesn't fit, compare it to the longest course we've already taken. If the current course is shorter, swap — drop the longest course and take this one instead. Total time decreases, leaving more room for future courses." },
        { step: "Use a max-heap", detail: "Maintain a max-heap of durations of taken courses. When a course doesn't fit, compare its duration to the heap's max. If current duration < heap max, pop the max and push the current. Update total time." },
        { step: "Why this is optimal", detail: "Sorting by deadline ensures we respect time ordering. The greedy swap is safe because: we maintain the same count of courses, but use less total time. Less time used = more room for future courses = at least as good." },
        { step: "Proof sketch", detail: "By exchange argument: any optimal solution that differs from ours can be transformed into ours by swapping courses without decreasing the count. The deadline sorting + replace-longest strategy is optimal." }
    ],
    keyInsight: "Sort by deadline, then greedily take courses. When a course doesn't fit, replace the longest taken course with the current one if it's shorter (using a max-heap). This maintains the course count while minimizing total time used, leaving room for future courses.",
    approach: "1. Sort courses by deadline.\n2. Use a max-heap to track taken course durations.\n3. For each course: if it fits, take it. If not, swap with the longest taken course if shorter.\n4. Return heap size.",
    solutionPython: `import heapq

def scheduleCourse(courses):
    # Sort by deadline
    courses.sort(key=lambda x: x[1])
    
    heap = []  # max-heap (negative durations)
    total_time = 0
    
    for duration, deadline in courses:
        if total_time + duration <= deadline:
            # Can take this course
            total_time += duration
            heapq.heappush(heap, -duration)
        elif heap and -heap[0] > duration:
            # Swap with longest course
            total_time += duration - (-heapq.heapreplace(heap, -duration))
    
    return len(heap)`,
    solutionCpp: `#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

int scheduleCourse(vector<vector<int>>& courses) {
    sort(courses.begin(), courses.end(),
         [](auto& a, auto& b) { return a[1] < b[1]; });
    
    priority_queue<int> pq; // max-heap of durations
    int total = 0;
    
    for (auto& c : courses) {
        int dur = c[0], deadline = c[1];
        if (total + dur <= deadline) {
            total += dur;
            pq.push(dur);
        } else if (!pq.empty() && pq.top() > dur) {
            total += dur - pq.top();
            pq.pop();
            pq.push(dur);
        }
    }
    return pq.size();
}`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    patternGuide: "Use **sort + greedy replacement with heap** when:\n- Scheduling tasks with deadlines to maximize count\n- You can improve by swapping a costly choice for a cheaper one\n- Exchange argument proves optimality\n\nSimilar: Job Scheduling, Meeting Rooms, IPO"
},
{
    id: 115,
    lcNumber: 759,
    title: "Employee Free Time",
    difficulty: "Hard",
    category: "Intervals",
    description: "We are given a list of `schedule` where `schedule[i]` is a list of non-overlapping intervals sorted by start time for the i-th employee. Return the list of finite intervals representing the common free time for ALL employees, sorted by start time.",
    examples: [
        "Input: schedule = [[[1,2],[5,6]],[[1,3]],[[4,10]]]\nOutput: [[3,4]]\nExplanation: All employees are busy during [1,3] and [4,10], so free time is [3,4].",
        "Input: schedule = [[[1,3],[6,7]],[[2,4]],[[2,5],[9,12]]]\nOutput: [[5,6],[7,9]]"
    ],
    thinkingProcess: [
        { step: "Flatten all intervals", detail: "Ignore which employee an interval belongs to. The free time for ALL employees is the gaps between the merged union of all busy intervals. Flatten all intervals into one list." },
        { step: "Sort by start time", detail: "Sort all intervals by start time. This lets us process them left to right and merge overlapping/adjacent intervals." },
        { step: "Find gaps between merged intervals", detail: "Track the latest end time seen (`prev_end`). For each interval: if `start > prev_end`, there's a gap `[prev_end, start]` — that's free time. Update `prev_end = max(prev_end, end)`." },
        { step: "Alternatively: merge then find gaps", detail: "First merge all overlapping intervals (standard merge intervals algorithm). Then the gaps between consecutive merged intervals are the free times. Same result, slightly different code structure." },
        { step: "Optimized with min-heap", detail: "Since each employee's schedule is already sorted, we can use a min-heap to merge k sorted lists efficiently. Pop the smallest-start interval, check for gap, update end. This avoids full sort." },
        { step: "Why this is correct", detail: "Free time = time when NO employee is busy. The union of all busy times covers all busy moments. Gaps in this union are exactly when everyone is free." }
    ],
    keyInsight: "Flatten all intervals, sort by start time, then find gaps between the merged intervals. A gap `[prev_end, current_start]` exists whenever `current_start > prev_end`. These gaps are the common free time for all employees.",
    approach: "1. Flatten all employee schedules into one list.\n2. Sort by start time.\n3. Track `prev_end` (latest end time).\n4. For each interval, if `start > prev_end`, add gap to result.\n5. Update `prev_end = max(prev_end, end)`.",
    solutionPython: `def employeeFreeTime(schedule):
    # Flatten all intervals
    intervals = []
    for emp in schedule:
        for interval in emp:
            intervals.append(interval)
    
    intervals.sort(key=lambda x: x.start)
    
    result = []
    prev_end = intervals[0].end
    
    for interval in intervals[1:]:
        if interval.start > prev_end:
            result.append(Interval(prev_end, interval.start))
        prev_end = max(prev_end, interval.end)
    
    return result`,
    solutionCpp: `#include <vector>
#include <algorithm>
using namespace std;

struct Interval {
    int start, end;
};

vector<Interval> employeeFreeTime(vector<vector<Interval>>& schedule) {
    vector<Interval> all;
    for (auto& emp : schedule)
        for (auto& iv : emp)
            all.push_back(iv);
    
    sort(all.begin(), all.end(),
         [](auto& a, auto& b) { return a.start < b.start; });
    
    vector<Interval> result;
    int prevEnd = all[0].end;
    
    for (int i = 1; i < (int)all.size(); i++) {
        if (all[i].start > prevEnd)
            result.push_back({prevEnd, all[i].start});
        prevEnd = max(prevEnd, all[i].end);
    }
    return result;
}`,
    timeComplexity: "O(n log n) where n = total intervals",
    spaceComplexity: "O(n)",
    patternGuide: "Use **flatten + sort + scan for gaps** when:\n- Finding free/unoccupied time across multiple schedules\n- Need gaps between merged intervals\n- Multiple sorted lists of intervals\n\nSimilar: Merge Intervals, Meeting Rooms II, Interval List Intersections"
},
{
    id: 116,
    lcNumber: 642,
    title: "Design Search Autocomplete System",
    difficulty: "Hard",
    category: "Design",
    description: "Design a search autocomplete system. Users type characters one by one. For each input character, return the top 3 historical hot sentences that have the same prefix as the part of the sentence already typed. Hot degree is the number of times a sentence has been typed before. If several sentences have the same degree, return in ASCII-code order. If `#` is input, the current sentence ends.",
    examples: [
        "Input: AutocompleteSystem([\"i love you\",\"island\",\"iroman\",\"i love leetcode\"], [5,3,2,2])\n  input('i') → [\"i love you\",\"island\",\"i love leetcode\"]\n  input(' ') → [\"i love you\",\"i love leetcode\"]\n  input('a') → []\n  input('#') → [] (saves \"i a\" with count 1)"
    ],
    thinkingProcess: [
        { step: "Choose the data structure: Trie", detail: "We need prefix matching — Trie is the natural choice. Each node can store all sentences that pass through it, or we can traverse to find completions." },
        { step: "Store counts in the Trie", detail: "Each sentence maps to a count (hot degree). At each Trie node, we could store a sorted list of top-3 sentences, or we could search on demand." },
        { step: "Design the input method", detail: "Maintain a `current_prefix` string. On each character (not #), append to prefix, search Trie for all sentences with that prefix, return top 3 by (-count, lexicographic order). On #, add/increment the completed sentence." },
        { step: "Optimization: track current node", detail: "Instead of searching from root every time, track the current Trie node as characters are typed. Each `input()` call just goes one level deeper. If the node doesn't exist, no results until #." },
        { step: "Top-3 extraction", detail: "At the current node, collect all sentences in its subtree. Sort by (-count, sentence). Return top 3. For efficiency, pre-store top sentences at each node, or use a heap." },
        { step: "Update on #", detail: "When # is typed, add the completed sentence to the Trie (increment its count). Reset current prefix and current node for the next query." }
    ],
    keyInsight: "Use a Trie where each node stores the sentences passing through it with their hot degrees. Track the current Trie node as characters are typed (avoid re-traversing from root). On each input, descend one level and return top-3 sentences by frequency. On `#`, save the new sentence.",
    approach: "1. Build Trie from historical sentences with counts.\n2. Track current node and prefix.\n3. On char input: descend in Trie, collect and return top-3 sentences.\n4. On `#`: add sentence to Trie, reset state.",
    solutionPython: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.sentences = {}  # sentence -> count

class AutocompleteSystem:
    def __init__(self, sentences, times):
        self.root = TrieNode()
        self.current = self.root
        self.prefix = ""
        self.dead = TrieNode()  # dead-end node
        
        for s, t in zip(sentences, times):
            self._add(s, t)
    
    def _add(self, sentence, count):
        node = self.root
        for ch in sentence:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
            node.sentences[sentence] = node.sentences.get(sentence, 0) + count
    
    def input(self, c):
        if c == '#':
            self._add(self.prefix, 1)
            self.prefix = ""
            self.current = self.root
            return []
        
        self.prefix += c
        if c in self.current.children:
            self.current = self.current.children[c]
        else:
            self.current = self.dead
            return []
        
        # Get top 3 by (-count, sentence)
        items = self.current.sentences.items()
        top3 = sorted(items, key=lambda x: (-x[1], x[0]))[:3]
        return [s for s, _ in top3]`,
    solutionCpp: `#include <string>
#include <vector>
#include <unordered_map>
#include <algorithm>
using namespace std;

struct TrieNode {
    unordered_map<char, TrieNode*> children;
    unordered_map<string, int> sentences;
};

class AutocompleteSystem {
    TrieNode* root;
    TrieNode* current;
    TrieNode dead;
    string prefix;
    
    void add(const string& s, int count) {
        TrieNode* node = root;
        for (char c : s) {
            if (!node->children[c])
                node->children[c] = new TrieNode();
            node = node->children[c];
            node->sentences[s] += count;
        }
    }
    
public:
    AutocompleteSystem(vector<string>& sentences, vector<int>& times) {
        root = new TrieNode();
        current = root;
        for (int i = 0; i < (int)sentences.size(); i++)
            add(sentences[i], times[i]);
    }
    
    vector<string> input(char c) {
        if (c == '#') {
            add(prefix, 1);
            prefix = "";
            current = root;
            return {};
        }
        prefix += c;
        if (current->children.count(c)) {
            current = current->children[c];
        } else {
            current = &dead;
            return {};
        }
        
        vector<pair<int, string>> items;
        for (auto& [s, cnt] : current->sentences)
            items.push_back({-cnt, s});
        sort(items.begin(), items.end());
        
        vector<string> result;
        for (int i = 0; i < min(3, (int)items.size()); i++)
            result.push_back(items[i].second);
        return result;
    }
};`,
    timeComplexity: "O(n log n) per input call (n = matching sentences)",
    spaceComplexity: "O(total characters in all sentences)",
    patternGuide: "Use **Trie with aggregation at nodes** when:\n- Prefix-based search/autocomplete\n- Need to maintain running statistics per prefix\n- Interactive character-by-character input\n\nSimilar: Search Suggestions System, Implement Trie, Word Search II"
},
{
    id: 117,
    lcNumber: 679,
    title: "24 Game",
    difficulty: "Hard",
    category: "Backtracking",
    description: "You are given an integer array `cards` of length 4. Each card has a value in [1, 9]. Using `+`, `-`, `*`, `/` and parentheses, determine if you can get the value 24 from the four cards. Each card must be used exactly once.",
    examples: [
        "Input: cards = [4,1,8,7]\nOutput: true\nExplanation: (8-4) * (7-1) = 24",
        "Input: cards = [1,2,1,2]\nOutput: false"
    ],
    thinkingProcess: [
        { step: "Understand the search space", detail: "4 cards, pick 2, apply an operation, get 3 numbers. Pick 2 again, apply op, get 2 numbers. Pick 2, apply op, get 1 number. Check if it's 24. We need to try all orderings and all operations." },
        { step: "Recursive reduction", detail: "From a list of numbers, pick any 2, combine them with any of 4 operations (+, -, *, /), and recurse with the resulting smaller list. Base case: one number left, check if it's 24." },
        { step: "Handle non-commutativity", detail: "For `-` and `/`, order matters: a-b ≠ b-a. So for each pair, try both orderings for non-commutative operations. For `+` and `*`, order doesn't matter but it's simpler to try both anyway." },
        { step: "Division edge cases", detail: "Can't divide by zero. Also use floating-point comparison: check if `abs(result - 24) < 1e-6` instead of exact equality, since division can produce floating-point imprecision." },
        { step: "Enumerate all pair combinations", detail: "From n numbers, choose indices i and j (i ≠ j). Apply each operation. Create a new list with the result replacing the pair. Recurse. This naturally handles all parenthesizations — the order we combine determines the grouping." },
        { step: "Why this covers all parenthesizations", detail: "((a○b)○c)○d, (a○(b○c))○d, (a○b)○(c○d), etc. — by choosing WHICH pair to combine first, we implicitly try all possible expression trees. No need to explicitly generate parenthesized expressions." }
    ],
    keyInsight: "Recursively reduce: pick any 2 numbers from the list, combine with any operation (4 ops × 2 orderings), recurse on the shorter list. This implicitly tries all parenthesizations. Base case: one number, check if ≈ 24. Use floating-point epsilon comparison.",
    approach: "1. From list of numbers, try all pairs (i, j) where i ≠ j.\n2. Try all 4 operations on (nums[i], nums[j]) and (nums[j], nums[i]).\n3. Create new list with result replacing the pair.\n4. Recurse. Base: one number ≈ 24.",
    solutionPython: `def judgePoint24(cards):
    if len(cards) == 1:
        return abs(cards[0] - 24) < 1e-6
    
    for i in range(len(cards)):
        for j in range(len(cards)):
            if i == j:
                continue
            rest = [cards[k] for k in range(len(cards)) if k != i and k != j]
            a, b = cards[i], cards[j]
            
            # Try all operations
            for result in [a+b, a-b, a*b] + ([a/b] if b != 0 else []):
                if judgePoint24(rest + [result]):
                    return True
    
    return False`,
    solutionCpp: `#include <vector>
#include <cmath>
using namespace std;

bool solve(vector<double>& nums) {
    if (nums.size() == 1)
        return abs(nums[0] - 24) < 1e-6;
    
    for (int i = 0; i < (int)nums.size(); i++) {
        for (int j = 0; j < (int)nums.size(); j++) {
            if (i == j) continue;
            vector<double> rest;
            for (int k = 0; k < (int)nums.size(); k++)
                if (k != i && k != j) rest.push_back(nums[k]);
            
            double a = nums[i], b = nums[j];
            vector<double> ops = {a+b, a-b, a*b};
            if (abs(b) > 1e-6) ops.push_back(a/b);
            
            for (double r : ops) {
                rest.push_back(r);
                if (solve(rest)) return true;
                rest.pop_back();
            }
        }
    }
    return false;
}

bool judgePoint24(vector<int>& cards) {
    vector<double> nums(cards.begin(), cards.end());
    return solve(nums);
}`,
    timeComplexity: "O(1) — bounded by 4 cards × 4 ops (≈ 9216 paths)",
    spaceComplexity: "O(1)",
    patternGuide: "Use **recursive reduction (pick-pair-combine)** when:\n- Combining elements with operators in all possible ways\n- Need to try all expression trees / parenthesizations\n- Small fixed input size allows brute-force enumeration\n\nSimilar: Different Ways to Add Parentheses, Expression Add Operators"
},
{
    id: 118,
    lcNumber: 715,
    title: "Range Module",
    difficulty: "Hard",
    category: "Design",
    description: "A Range Module tracks ranges of numbers. Implement `addRange(left, right)` to track the half-open interval `[left, right)`, `queryRange(left, right)` to check if every number in `[left, right)` is tracked, and `removeRange(left, right)` to stop tracking all numbers in `[left, right)`.",
    examples: [
        "addRange(10, 20) → tracked: [10, 20)\nremoveRange(14, 16) → tracked: [10, 14), [16, 20)\nqueryRange(10, 14) → true\nqueryRange(13, 15) → false\nqueryRange(16, 17) → true"
    ],
    thinkingProcess: [
        { step: "Maintain sorted, non-overlapping intervals", detail: "The tracked ranges should be a sorted list of non-overlapping intervals. Each operation modifies this list. The key challenge is efficiently finding and merging affected intervals." },
        { step: "addRange: merge overlapping intervals", detail: "Find all existing intervals that overlap with [left, right). Merge them: new left = min(existing lefts, left), new right = max(existing rights, right). Remove old intervals, insert merged one." },
        { step: "removeRange: split intervals", detail: "Find all intervals overlapping [left, right). For each, trim or split: if an interval partially overlaps, keep the non-overlapping parts. Remove fully covered intervals." },
        { step: "queryRange: check full coverage", detail: "Find the interval containing `left`. If it exists and its right boundary >= `right`, the range is fully covered. Otherwise, it's not." },
        { step: "Data structure choice", detail: "Use a sorted container (SortedList in Python, std::map in C++). Map left→right for each interval. Use binary search to find overlapping intervals efficiently." },
        { step: "Implementation with sorted map", detail: "Store intervals as a sorted map: `key=left, value=right`. For add/remove, use lower_bound to find the first potentially overlapping interval. Iterate and merge/split as needed." }
    ],
    keyInsight: "Maintain a sorted map of non-overlapping intervals (left→right). For add: find and merge all overlapping intervals. For remove: find and split/trim overlapping intervals. For query: find the interval containing `left` and check if it extends past `right`. Use binary search for efficiency.",
    approach: "1. Store intervals in a sorted map (left → right).\n2. addRange: find overlapping intervals, merge into one.\n3. removeRange: find overlapping intervals, trim/split.\n4. queryRange: binary search for containing interval.",
    solutionPython: `from sortedcontainers import SortedDict

class RangeModule:
    def __init__(self):
        self.intervals = SortedDict()
    
    def addRange(self, left, right):
        # Find overlapping intervals and merge
        i = self.intervals.bisect_left(left)
        # Check if previous interval overlaps
        if i > 0 and self.intervals.values()[i-1] >= left:
            i -= 1
        
        while i < len(self.intervals):
            l = self.intervals.keys()[i]
            if l > right:
                break
            r = self.intervals.values()[i]
            left = min(left, l)
            right = max(right, r)
            self.intervals.popitem(i)
        
        self.intervals[left] = right
    
    def queryRange(self, left, right):
        i = self.intervals.bisect_right(left) - 1
        if i < 0:
            return False
        return self.intervals.values()[i] >= right
    
    def removeRange(self, left, right):
        i = self.intervals.bisect_left(left)
        if i > 0 and self.intervals.values()[i-1] > left:
            i -= 1
        
        to_add = []
        while i < len(self.intervals):
            l = self.intervals.keys()[i]
            if l >= right:
                break
            r = self.intervals.values()[i]
            self.intervals.popitem(i)
            if l < left:
                to_add.append((l, left))
            if r > right:
                to_add.append((right, r))
        
        for l, r in to_add:
            self.intervals[l] = r`,
    solutionCpp: `#include <map>
using namespace std;

class RangeModule {
    map<int, int> intervals; // left -> right
    
public:
    void addRange(int left, int right) {
        auto it = intervals.upper_bound(left);
        if (it != intervals.begin() && prev(it)->second >= left)
            --it;
        
        while (it != intervals.end() && it->first <= right) {
            left = min(left, it->first);
            right = max(right, it->second);
            it = intervals.erase(it);
        }
        intervals[left] = right;
    }
    
    bool queryRange(int left, int right) {
        auto it = intervals.upper_bound(left);
        if (it == intervals.begin()) return false;
        --it;
        return it->second >= right;
    }
    
    void removeRange(int left, int right) {
        auto it = intervals.upper_bound(left);
        if (it != intervals.begin() && prev(it)->second > left)
            --it;
        
        vector<pair<int,int>> toAdd;
        while (it != intervals.end() && it->first < right) {
            if (it->first < left) toAdd.push_back({it->first, left});
            if (it->second > right) toAdd.push_back({right, it->second});
            it = intervals.erase(it);
        }
        for (auto& [l, r] : toAdd) intervals[l] = r;
    }
};`,
    timeComplexity: "O(n) per operation worst case, O(log n) amortized",
    spaceComplexity: "O(n)",
    patternGuide: "Use **sorted map of intervals** when:\n- Dynamic add/remove of ranges\n- Need to merge overlapping intervals on the fly\n- Query whether a point/range is covered\n\nSimilar: My Calendar I/II/III, Count Integers in Intervals"
},
{
    id: 119,
    lcNumber: 726,
    title: "Number of Atoms",
    difficulty: "Hard",
    category: "Stack",
    description: "Given a string `formula` representing a chemical formula, return the count of each atom sorted by atom name. A formula can have nested groups with parentheses and multipliers, e.g., `K4(ON(SO3)2)2`.",
    examples: [
        "Input: formula = \"H2O\"\nOutput: \"H2O\"",
        "Input: formula = \"Mg(OH)2\"\nOutput: \"H2MgO2\"",
        "Input: formula = \"K4(ON(SO3)2)2\"\nOutput: \"K4N2O14S4\""
    ],
    thinkingProcess: [
        { step: "Parse nested structure with a stack", detail: "Parentheses create nesting. Use a stack of hashmaps: each level tracks atom counts at that nesting depth. When we hit `(`, push a new empty map. When we hit `)`, pop and multiply, then merge into the parent level." },
        { step: "Parse atom names", detail: "An atom name starts with an uppercase letter optionally followed by lowercase letters. E.g., `Mg`, `O`, `S`. Read the full name character by character." },
        { step: "Parse numbers", detail: "After an atom name or `)`, there may be a number (one or more digits). If no number, the count is 1. Parse multi-digit numbers." },
        { step: "Processing `(`", detail: "Push a new empty counter onto the stack. This starts a new scope for counting atoms inside the group." },
        { step: "Processing `)`", detail: "Read the multiplier after `)`. Pop the top counter. Multiply all counts by the multiplier. Merge into the counter now on top of the stack." },
        { step: "Final output", detail: "After processing all characters, the stack has one counter. Sort atoms alphabetically. Format as atom + count (omit count if 1)." }
    ],
    keyInsight: "Use a stack of counters (hashmaps). Push a new counter on `(`, pop on `)` and multiply all counts by the following number. Merge popped counts into the parent. This naturally handles arbitrary nesting depth.",
    approach: "1. Stack of hashmaps. Start with one empty map.\n2. Parse atoms (uppercase + lowercase*), then optional number.\n3. On `(`: push new map. On `)`: pop, multiply by number, merge.\n4. Sort final map alphabetically, format output.",
    solutionPython: `from collections import Counter

def countOfAtoms(formula):
    stack = [Counter()]
    i = 0
    n = len(formula)
    
    while i < n:
        if formula[i] == '(':
            stack.append(Counter())
            i += 1
        elif formula[i] == ')':
            i += 1
            # Parse multiplier
            start = i
            while i < n and formula[i].isdigit():
                i += 1
            mult = int(formula[start:i] or 1)
            
            top = stack.pop()
            for atom, count in top.items():
                stack[-1][atom] += count * mult
        else:
            # Parse atom name
            start = i
            i += 1
            while i < n and formula[i].islower():
                i += 1
            atom = formula[start:i]
            
            # Parse count
            start = i
            while i < n and formula[i].isdigit():
                i += 1
            count = int(formula[start:i] or 1)
            
            stack[-1][atom] += count
    
    result = stack[0]
    return ''.join(
        atom + (str(result[atom]) if result[atom] > 1 else '')
        for atom in sorted(result)
    )`,
    solutionCpp: `#include <string>
#include <map>
#include <stack>
using namespace std;

string countOfAtoms(string formula) {
    stack<map<string, int>> stk;
    stk.push({});
    int i = 0, n = formula.size();
    
    while (i < n) {
        if (formula[i] == '(') {
            stk.push({});
            i++;
        } else if (formula[i] == ')') {
            i++;
            int num = 0;
            while (i < n && isdigit(formula[i]))
                num = num * 10 + (formula[i++] - '0');
            if (num == 0) num = 1;
            
            auto top = stk.top(); stk.pop();
            for (auto& [atom, cnt] : top)
                stk.top()[atom] += cnt * num;
        } else {
            int start = i++;
            while (i < n && islower(formula[i])) i++;
            string atom = formula.substr(start, i - start);
            
            int num = 0;
            while (i < n && isdigit(formula[i]))
                num = num * 10 + (formula[i++] - '0');
            if (num == 0) num = 1;
            
            stk.top()[atom] += num;
        }
    }
    
    string result;
    for (auto& [atom, cnt] : stk.top()) {
        result += atom;
        if (cnt > 1) result += to_string(cnt);
    }
    return result;
}`,
    timeComplexity: "O(n + k log k) where k = unique atoms",
    spaceComplexity: "O(n)",
    patternGuide: "Use **stack of counters/maps** when:\n- Parsing nested structures with multipliers\n- Each nesting level accumulates data independently\n- Need to merge child data into parent on close\n\nSimilar: Decode String, Basic Calculator, Brace Expansion"
},
{
    id: 120,
    lcNumber: 741,
    title: "Cherry Pickup",
    difficulty: "Hard",
    category: "Dynamic Programming",
    description: "You are given an `n x n` grid. Each cell is 0 (empty), 1 (cherry), or -1 (thorn/obstacle). Start at `(0,0)`, reach `(n-1,n-1)` moving right or down, then return to `(0,0)` moving left or up. Collect cherries on both trips. A cherry is collected once. Return the maximum cherries you can collect. If no valid path exists, return 0.",
    examples: [
        "Input: grid = [[0,1,-1],[1,0,-1],[1,1,1]]\nOutput: 5\nExplanation: Go right, down, down (collect 3 cherries). Return left, up, up (collect 2 more)."
    ],
    thinkingProcess: [
        { step: "Naive approach fails", detail: "Greedy: find the best path there, remove collected cherries, find the best path back. This fails because the best single path may block a better pair of paths. We need to optimize both paths simultaneously." },
        { step: "Key insight: two simultaneous forward paths", detail: "Instead of one path there and one back, model as TWO people walking simultaneously from `(0,0)` to `(n-1,n-1)`, both moving right or down. If they're on the same cell, the cherry is counted only once." },
        { step: "Why simultaneous paths work", detail: "A path from `(n-1,n-1)` to `(0,0)` going left/up is equivalent to a path from `(0,0)` to `(n-1,n-1)` going right/down (just reversed). So two forward paths simulate the there-and-back." },
        { step: "DP formulation", detail: "Both walkers take the same number of steps. At step `t`, walker 1 is at `(r1, t-r1)` and walker 2 is at `(r2, t-r2)`. State: `dp[t][r1][r2]` = max cherries when walkers are at rows r1, r2 after t steps." },
        { step: "Transitions", detail: "Each walker can move right or down. So 4 combinations: (down,down), (down,right), (right,down), (right,right). Take the max over all 4, adding cherries at the new positions (avoiding double-count if same cell)." },
        { step: "Reduce dimensions", detail: "Since `c1 = t - r1` and `c2 = t - r2`, we only need 3 dimensions: `(t, r1, r2)`. And `t` ranges from 0 to `2(n-1)`, while r1 and r2 range from 0 to n-1." }
    ],
    keyInsight: "Model as two people walking simultaneously from (0,0) to (n-1,n-1). DP state: `dp[r1][r2]` at step t. Both move right or down each step. If they're on the same cell, count cherry once. This avoids the greedy pitfall of optimizing one path at a time.",
    approach: "1. Two walkers from (0,0) to (n-1,n-1).\n2. DP: `dp[r1][r2]` = max cherries at step t with rows r1, r2.\n3. Iterate over steps t = 0 to 2(n-1).\n4. Each step: try all 4 movement combos.\n5. If same cell, count cherry once; else count both.",
    solutionPython: `def cherryPickup(grid):
    n = len(grid)
    INF = float('-inf')
    
    # dp[r1][r2] = max cherries at step t
    dp = [[INF] * n for _ in range(n)]
    dp[0][0] = grid[0][0]
    
    for t in range(1, 2 * n - 1):
        new_dp = [[INF] * n for _ in range(n)]
        for r1 in range(max(0, t - n + 1), min(n, t + 1)):
            c1 = t - r1
            if c1 < 0 or c1 >= n or grid[r1][c1] == -1:
                continue
            for r2 in range(r1, min(n, t + 1)):
                c2 = t - r2
                if c2 < 0 or c2 >= n or grid[r2][c2] == -1:
                    continue
                
                # Cherries at current positions
                val = grid[r1][c1]
                if r1 != r2:
                    val += grid[r2][c2]
                
                # Try all previous states
                best = INF
                for pr1 in (r1, r1 - 1):
                    for pr2 in (r2, r2 - 1):
                        if 0 <= pr1 < n and 0 <= pr2 < n:
                            best = max(best, dp[pr1][pr2])
                
                if best != INF:
                    new_dp[r1][r2] = best + val
        dp = new_dp
    
    return max(0, dp[n-1][n-1])`,
    solutionCpp: `#include <vector>
#include <algorithm>
using namespace std;

int cherryPickup(vector<vector<int>>& grid) {
    int n = grid.size();
    const int NEG = -1e9;
    
    vector<vector<int>> dp(n, vector<int>(n, NEG));
    dp[0][0] = grid[0][0];
    
    for (int t = 1; t < 2*n - 1; t++) {
        vector<vector<int>> ndp(n, vector<int>(n, NEG));
        for (int r1 = max(0, t-n+1); r1 < min(n, t+1); r1++) {
            int c1 = t - r1;
            if (c1 < 0 || c1 >= n || grid[r1][c1] == -1) continue;
            for (int r2 = r1; r2 < min(n, t+1); r2++) {
                int c2 = t - r2;
                if (c2 < 0 || c2 >= n || grid[r2][c2] == -1) continue;
                
                int val = grid[r1][c1];
                if (r1 != r2) val += grid[r2][c2];
                
                int best = NEG;
                for (int pr1 : {r1, r1-1})
                    for (int pr2 : {r2, r2-1})
                        if (pr1>=0 && pr2>=0)
                            best = max(best, dp[pr1][pr2]);
                
                if (best != NEG) ndp[r1][r2] = best + val;
            }
        }
        dp = ndp;
    }
    return max(0, dp[n-1][n-1]);
}`,
    timeComplexity: "O(n³)",
    spaceComplexity: "O(n²)",
    patternGuide: "Use **two-walker DP** when:\n- Round-trip path optimization (go and return)\n- Two paths that interact (shared resources)\n- Greedy single-path approach fails\n\nSimilar: Cherry Pickup II, Minimum Path Sum, Dungeon Game"
},
{
    id: 121,
    lcNumber: 895,
    title: "Maximum Frequency Stack",
    difficulty: "Hard",
    category: "Design",
    description: "Design a stack-like data structure that pushes elements and pops the most frequent element. If there is a tie, pop the element closest to the top (most recently pushed). Implement `FreqStack()`, `push(val)`, and `pop()`.",
    examples: [
        "push(5), push(7), push(5), push(7), push(4), push(5)\npop() → 5 (freq 3)\npop() → 7 (freq 2)\npop() → 5 (freq 2)\npop() → 4 (freq 1)"
    ],
    thinkingProcess: [
        { step: "Understand the pop priority", detail: "Pop the element with the highest frequency. If tied, pop the one pushed most recently. This is like having multiple 'layers' — layer 1 has all elements (pushed once), layer 2 has elements pushed at least twice, etc." },
        { step: "Frequency groups insight", detail: "Group elements by frequency. Frequency 1: all elements. Frequency 2: elements that appeared ≥2 times. Frequency 3: elements ≥3 times. Each group is a stack (for recency). Pop from the highest-frequency group." },
        { step: "Data structures needed", detail: "1. `freq`: map from value → current frequency. 2. `group`: map from frequency → stack of values. 3. `maxFreq`: current maximum frequency." },
        { step: "Push operation", detail: "Increment `freq[val]`. Push `val` onto `group[freq[val]]`. Update `maxFreq`. Note: val appears in multiple groups (once per frequency level it reaches)." },
        { step: "Pop operation", detail: "Pop from `group[maxFreq]`. Decrement `freq[val]`. If `group[maxFreq]` is now empty, decrement `maxFreq`. The element remains in lower frequency groups." },
        { step: "Why this works", detail: "Each push adds the element to a new frequency layer. Pop removes from the highest layer. Since within a layer elements are in push-order (stack), ties are broken by recency. Elegant O(1) for both operations." }
    ],
    keyInsight: "Group elements by their frequency, each group is a stack. Push adds element to its current frequency group. Pop removes from the max-frequency group (stack top = most recent). Track `maxFreq` and decrement when a group empties. All operations O(1).",
    approach: "1. `freq` map: value → count.\n2. `group` map: frequency → stack of values.\n3. Push: increment freq, push to group[freq].\n4. Pop: pop from group[maxFreq], decrement freq, adjust maxFreq.",
    solutionPython: `from collections import defaultdict

class FreqStack:
    def __init__(self):
        self.freq = defaultdict(int)
        self.group = defaultdict(list)
        self.max_freq = 0
    
    def push(self, val):
        self.freq[val] += 1
        f = self.freq[val]
        self.group[f].append(val)
        self.max_freq = max(self.max_freq, f)
    
    def pop(self):
        val = self.group[self.max_freq].pop()
        self.freq[val] -= 1
        if not self.group[self.max_freq]:
            self.max_freq -= 1
        return val`,
    solutionCpp: `#include <unordered_map>
#include <stack>
using namespace std;

class FreqStack {
    unordered_map<int, int> freq;
    unordered_map<int, stack<int>> group;
    int maxFreq = 0;
    
public:
    void push(int val) {
        int f = ++freq[val];
        group[f].push(val);
        maxFreq = max(maxFreq, f);
    }
    
    int pop() {
        int val = group[maxFreq].top();
        group[maxFreq].pop();
        freq[val]--;
        if (group[maxFreq].empty()) maxFreq--;
        return val;
    }
};`,
    timeComplexity: "O(1) per push and pop",
    spaceComplexity: "O(n)",
    patternGuide: "Use **frequency-grouped stacks** when:\n- Priority based on frequency + recency\n- Need O(1) push/pop with frequency tracking\n- Elements exist in multiple logical layers\n\nSimilar: LFU Cache, All O'one Data Structure"
},
{
    id: 122,
    lcNumber: 803,
    title: "Bricks Falling When Hit",
    difficulty: "Hard",
    category: "Union Find",
    description: "You have a grid of bricks (1 = brick, 0 = empty). A brick is stable if it's in the top row or adjacent to a stable brick. Given a sequence of hits (erasures), return an array where each element is the number of bricks that fall after each hit.",
    examples: [
        "Input: grid = [[1,0,0,0],[1,1,1,0]], hits = [[1,0]]\nOutput: [2]\nExplanation: Removing brick at (1,0) causes (1,1) and (1,2) to fall since they lose connection to top row.",
        "Input: grid = [[1,0,0,0],[1,1,0,0]], hits = [[1,1],[1,0]]\nOutput: [0,0]"
    ],
    thinkingProcess: [
        { step: "Forward simulation is expensive", detail: "After each hit, we'd need BFS/DFS to figure out which bricks are no longer stable. With many hits, this is O(hits × grid_size). Can we do better?" },
        { step: "Reverse thinking: add bricks back", detail: "Process hits in REVERSE order. Start with all hits already applied. Then add bricks back one by one. When a brick is added back, it may reconnect a group to the top row, causing that group to become stable." },
        { step: "Union Find for connectivity", detail: "Use Union Find to track connected components. Add a virtual 'roof' node connected to all top-row bricks. A brick is stable if its component is connected to the roof." },
        { step: "Reverse process", detail: "Start with the grid after all hits. Build initial Union Find. Then for each hit (in reverse): add the brick back, union with neighbors, check if this connects a new group to the roof. The newly stabilized bricks = the ones that fell in the forward direction." },
        { step: "Count newly stable bricks", detail: "Before adding a brick: count bricks connected to roof. After adding and union-ing: count again. The difference (minus 1 for the brick itself) is the number that fell." },
        { step: "Handle edge case", detail: "If the hit position was already 0 (no brick there), it causes 0 falls. Mark such positions to handle correctly." }
    ],
    keyInsight: "Process hits in reverse (add bricks back instead of removing them). Use Union Find with a virtual roof node. When a brick is added back and connects a disconnected group to the roof, those bricks become stable — in the forward direction, they were the ones that fell.",
    approach: "1. Apply all hits to grid.\n2. Build Union Find with virtual roof for top row.\n3. Process hits in reverse: add brick back, union with neighbors.\n4. Newly roof-connected bricks = bricks that fell in forward order.\n5. Return results reversed.",
    solutionPython: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n
    
    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x
    
    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb: return
        if self.size[ra] < self.size[rb]: ra, rb = rb, ra
        self.parent[rb] = ra
        self.size[ra] += self.size[rb]

def hitBricks(grid, hits):
    rows, cols = len(grid), len(grid[0])
    ROOF = rows * cols  # virtual node
    
    # Mark hits (save original, set to 0)
    original = []
    for r, c in hits:
        original.append(grid[r][c])
        grid[r][c] = 0
    
    uf = UnionFind(rows * cols + 1)
    
    def idx(r, c): return r * cols + c
    
    # Build UF for remaining grid
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 0: continue
            if r == 0: uf.union(idx(r, c), ROOF)
            if r > 0 and grid[r-1][c]: uf.union(idx(r,c), idx(r-1,c))
            if c > 0 and grid[r][c-1]: uf.union(idx(r,c), idx(r,c-1))
    
    result = []
    for i in range(len(hits) - 1, -1, -1):
        r, c = hits[i]
        if original[i] == 0:
            result.append(0)
            continue
        
        prev_roof = uf.size[uf.find(ROOF)]
        grid[r][c] = 1
        if r == 0: uf.union(idx(r, c), ROOF)
        for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc]:
                uf.union(idx(r, c), idx(nr, nc))
        
        new_roof = uf.size[uf.find(ROOF)]
        result.append(max(0, new_roof - prev_roof - 1))
    
    return result[::-1]`,
    solutionCpp: `#include <vector>
using namespace std;

class UnionFind {
public:
    vector<int> parent, sz;
    UnionFind(int n) : parent(n), sz(n, 1) {
        iota(parent.begin(), parent.end(), 0);
    }
    int find(int x) {
        while (parent[x] != x) x = parent[x] = parent[parent[x]];
        return x;
    }
    void unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return;
        if (sz[a] < sz[b]) swap(a, b);
        parent[b] = a; sz[a] += sz[b];
    }
};

vector<int> hitBricks(vector<vector<int>>& grid, vector<vector<int>>& hits) {
    int R = grid.size(), C = grid[0].size(), ROOF = R * C;
    vector<int> orig;
    for (auto& h : hits) { orig.push_back(grid[h[0]][h[1]]); grid[h[0]][h[1]] = 0; }
    
    UnionFind uf(R * C + 1);
    auto idx = [&](int r, int c) { return r * C + c; };
    int dirs[][2] = {{-1,0},{1,0},{0,-1},{0,1}};
    
    for (int r = 0; r < R; r++)
        for (int c = 0; c < C; c++) {
            if (!grid[r][c]) continue;
            if (r == 0) uf.unite(idx(r,c), ROOF);
            if (r > 0 && grid[r-1][c]) uf.unite(idx(r,c), idx(r-1,c));
            if (c > 0 && grid[r][c-1]) uf.unite(idx(r,c), idx(r,c-1));
        }
    
    vector<int> result(hits.size());
    for (int i = hits.size()-1; i >= 0; i--) {
        int r = hits[i][0], c = hits[i][1];
        if (orig[i] == 0) { result[i] = 0; continue; }
        int prev = uf.sz[uf.find(ROOF)];
        grid[r][c] = 1;
        if (r == 0) uf.unite(idx(r,c), ROOF);
        for (auto& d : dirs) {
            int nr = r+d[0], nc = c+d[1];
            if (nr>=0&&nr<R&&nc>=0&&nc<C&&grid[nr][nc])
                uf.unite(idx(r,c), idx(nr,nc));
        }
        result[i] = max(0, uf.sz[uf.find(ROOF)] - prev - 1);
    }
    return result;
}`,
    timeComplexity: "O((R×C + hits) × α(R×C))",
    spaceComplexity: "O(R × C)",
    patternGuide: "Use **reverse-time Union Find** when:\n- Removals are hard but additions are easy\n- Process deletions backwards as insertions\n- Virtual nodes for boundary conditions (roof, walls)\n\nSimilar: Redundant Connection II, Accounts Merge, Swim in Rising Water"
},
{
    id: 123,
    lcNumber: 815,
    title: "Bus Routes",
    difficulty: "Hard",
    category: "Graph BFS/DFS",
    description: "You are given an array `routes` where `routes[i]` is a bus route that the i-th bus repeats forever. Return the least number of buses you must take to travel from `source` to `target`. Return -1 if it's not possible. You start at `source` (not on a bus).",
    examples: [
        "Input: routes = [[1,2,7],[3,6,7]], source = 1, target = 6\nOutput: 2\nExplanation: Take bus 0 (stop 1 → stop 7), then bus 1 (stop 7 → stop 6).",
        "Input: routes = [[7,12],[4,5,15],[6],[15,19],[9,12,13]], source = 15, target = 12\nOutput: -1"
    ],
    thinkingProcess: [
        { step: "Model as a graph — but of what?", detail: "BFS on individual stops would work but be very slow (routes can have millions of stops). Instead, model BUSES as nodes. Two buses are connected if they share a stop. BFS on buses finds minimum transfers." },
        { step: "Build stop → buses mapping", detail: "Create a map: each stop → list of buses that serve it. This lets us find which buses connect at each stop." },
        { step: "BFS on buses", detail: "Start: all buses that serve the source stop (distance = 1 bus). For each bus, check all its stops. For each stop, check all other buses that serve it (neighbors). First bus that serves the target → return distance." },
        { step: "Optimization: mark buses visited, not stops", detail: "Mark visited BUSES (not stops) to avoid re-exploring. Also mark visited STOPS to avoid re-processing the same stop's bus list. This prevents O(n²) blowup." },
        { step: "Edge case", detail: "If source == target, return 0 (no bus needed)." },
        { step: "Complexity", detail: "Each bus and each stop is visited at most once. Building the stop→buses map is O(sum of route lengths). BFS is also O(sum of route lengths). Total: O(sum of all route lengths)." }
    ],
    keyInsight: "BFS on buses (not stops). Two buses are connected if they share a stop. Build a stop→buses mapping. Start BFS from all buses containing the source. For each bus, expand to all buses reachable via shared stops. First bus containing target gives the answer.",
    approach: "1. Map each stop to the buses that serve it.\n2. BFS: start with buses serving source (distance 1).\n3. For each bus, iterate its stops. For each stop, queue unvisited buses.\n4. If a bus serves target, return current distance.\n5. Mark both buses and stops as visited.",
    solutionPython: `from collections import defaultdict, deque

def numBusesToDestination(routes, source, target):
    if source == target:
        return 0
    
    # stop -> list of bus indices
    stop_to_buses = defaultdict(set)
    for i, route in enumerate(routes):
        for stop in route:
            stop_to_buses[stop].add(i)
    
    # BFS on buses
    visited_buses = set()
    visited_stops = {source}
    queue = deque()
    
    # Start with all buses at source
    for bus in stop_to_buses[source]:
        visited_buses.add(bus)
        queue.append((bus, 1))
    
    while queue:
        bus, dist = queue.popleft()
        
        for stop in routes[bus]:
            if stop == target:
                return dist
            if stop in visited_stops:
                continue
            visited_stops.add(stop)
            
            for next_bus in stop_to_buses[stop]:
                if next_bus not in visited_buses:
                    visited_buses.add(next_bus)
                    queue.append((next_bus, dist + 1))
    
    return -1`,
    solutionCpp: `#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <queue>
using namespace std;

int numBusesToDestination(vector<vector<int>>& routes, int source, int target) {
    if (source == target) return 0;
    
    unordered_map<int, vector<int>> stopToBuses;
    for (int i = 0; i < (int)routes.size(); i++)
        for (int stop : routes[i])
            stopToBuses[stop].push_back(i);
    
    unordered_set<int> visitedBuses, visitedStops = {source};
    queue<pair<int,int>> q;
    
    for (int bus : stopToBuses[source]) {
        visitedBuses.insert(bus);
        q.push({bus, 1});
    }
    
    while (!q.empty()) {
        auto [bus, dist] = q.front(); q.pop();
        for (int stop : routes[bus]) {
            if (stop == target) return dist;
            if (visitedStops.count(stop)) continue;
            visitedStops.insert(stop);
            for (int nb : stopToBuses[stop]) {
                if (!visitedBuses.count(nb)) {
                    visitedBuses.insert(nb);
                    q.push({nb, dist + 1});
                }
            }
        }
    }
    return -1;
}`,
    timeComplexity: "O(sum of route lengths)",
    spaceComplexity: "O(sum of route lengths)",
    patternGuide: "Use **BFS on higher-level nodes** when:\n- BFS on raw nodes is too expensive\n- Natural grouping exists (buses, zones, layers)\n- Minimum transitions between groups\n\nSimilar: Word Ladder, Minimum Genetic Mutation, Cheapest Flights Within K Stops"
},
{
    id: 124,
    lcNumber: 843,
    title: "Guess the Word",
    difficulty: "Hard",
    category: "Design",
    description: "You are given an array of unique secret words and a `Master` API. You can call `master.guess(word)` which returns the number of exact character matches with the secret word. You must guess the secret word in at most 10 calls. Design a strategy to find it.",
    examples: [
        "Input: secret = \"acckzz\", wordlist = [\"acckzz\",\"ccbazz\",\"eiowzz\",...]\nExplanation: Call master.guess(\"acckzz\") → returns 6 (found!)"
    ],
    thinkingProcess: [
        { step: "Understand the constraint: only 10 guesses", detail: "With potentially hundreds of words, random guessing won't work. Each guess gives information (match count) that we must use to eliminate impossible candidates." },
        { step: "Elimination strategy", detail: "After guessing word W and getting match count M, any word that doesn't have exactly M matches with W cannot be the secret. Remove all such words from the candidate list." },
        { step: "How to pick the best guess", detail: "We want to pick a word that eliminates the most candidates regardless of the match count. For each candidate word, compute the distribution of match counts with all other candidates." },
        { step: "Minimax: minimize worst case", detail: "For each candidate W, compute how many words have 0 matches with W, 1 match, 2 matches, etc. The worst case is the largest group. Pick W that minimizes the largest group — this guarantees maximum elimination in the worst case." },
        { step: "Why focus on 0-match group", detail: "In practice, the 0-match group tends to be the largest (most word pairs have few matches). Minimizing the 0-match group size is a good heuristic and is simpler to implement." },
        { step: "Convergence", detail: "With 6-character words, each guess typically eliminates most candidates. After ~10 guesses, the candidate list should be reduced to 1 (the secret)." }
    ],
    keyInsight: "Minimax strategy: pick the guess word that minimizes the worst-case remaining candidates. After each guess, eliminate words that don't have the exact match count with the guessed word. Focus on minimizing the 0-match group size as a practical heuristic.",
    approach: "1. Start with all words as candidates.\n2. Pick the candidate with the smallest max-group (minimax).\n3. Call master.guess(). Filter candidates by match count.\n4. Repeat until found (≤ 10 iterations).",
    solutionPython: `def findSecretWord(wordlist, master):
    def match_count(w1, w2):
        return sum(a == b for a, b in zip(w1, w2))
    
    candidates = list(wordlist)
    
    for _ in range(10):
        # Pick word that minimizes the max group size
        # Heuristic: minimize 0-match group
        best_word = candidates[0]
        best_zero = len(candidates)
        
        for word in candidates:
            zero_matches = sum(
                1 for other in candidates if match_count(word, other) == 0
            )
            if zero_matches < best_zero:
                best_zero = zero_matches
                best_word = word
        
        matches = master.guess(best_word)
        if matches == 6:
            return
        
        # Filter candidates
        candidates = [
            w for w in candidates
            if match_count(w, best_word) == matches
        ]`,
    solutionCpp: `#include <vector>
#include <string>
using namespace std;

void findSecretWord(vector<string>& wordlist, Master& master) {
    auto matchCount = [](const string& a, const string& b) {
        int cnt = 0;
        for (int i = 0; i < (int)a.size(); i++)
            if (a[i] == b[i]) cnt++;
        return cnt;
    };
    
    vector<string> candidates = wordlist;
    
    for (int t = 0; t < 10; t++) {
        // Pick word minimizing 0-match group
        string best = candidates[0];
        int bestZero = candidates.size();
        for (auto& w : candidates) {
            int zeros = 0;
            for (auto& o : candidates)
                if (matchCount(w, o) == 0) zeros++;
            if (zeros < bestZero) {
                bestZero = zeros;
                best = w;
            }
        }
        
        int matches = master.guess(best);
        if (matches == 6) return;
        
        vector<string> next;
        for (auto& w : candidates)
            if (matchCount(w, best) == matches)
                next.push_back(w);
        candidates = next;
    }
}`,
    timeComplexity: "O(n² × 10) where n = wordlist size",
    spaceComplexity: "O(n)",
    patternGuide: "Use **minimax elimination** when:\n- Limited number of queries/guesses\n- Each query returns partial information\n- Need to maximize information gain per query\n\nSimilar: Mastermind, Binary Search on Answer, 20 Questions"
},
{
    id: 125,
    lcNumber: 772,
    title: "Basic Calculator III",
    difficulty: "Hard",
    category: "Stack",
    description: "Implement a basic calculator to evaluate a string expression containing `+`, `-`, `*`, `/`, parentheses, spaces, and non-negative integers. Integer division truncates toward zero. The expression is guaranteed to be valid.",
    examples: [
        "Input: s = \"2*(5+5*2)/3+(6/2+8)\"\nOutput: 21",
        "Input: s = \"(2+6* 3+5- (3*14/7+2)*5)+3\"\nOutput: -12"
    ],
    thinkingProcess: [
        { step: "Combines Calculator I and II", detail: "Calculator I had +, - and parentheses. Calculator II had +, -, *, / without parentheses. Calculator III has everything. We need to handle both operator precedence AND nesting." },
        { step: "Approach: recursive descent", detail: "When we hit `(`, recursively evaluate the sub-expression until `)`. This handles nesting. Within each level, handle * / before + - (operator precedence)." },
        { step: "Alternative: stack-based with two stacks", detail: "Use a number stack and an operator stack. Push numbers and operators. When the current operator has lower or equal precedence than the stack top, pop and evaluate. `(` pushes, `)` evaluates until `(`." },
        { step: "Simpler: single stack approach", detail: "Track the last operator (`sign`). For `+`/`-`: push the number onto the stack (with sign). For `*`/`/`: pop the top, compute with current number, push result. For `(`: push sign and a marker, recurse." },
        { step: "Handle precedence naturally", detail: "By immediately computing `*` and `/` (combining with stack top) but deferring `+` and `-` (just pushing), we naturally handle precedence. Final answer = sum of stack." },
        { step: "Handle parentheses", detail: "On `(`: save current state (stack + sign) and start fresh. On `)`: compute sum of current stack, restore previous state, and use the result as the current number." }
    ],
    keyInsight: "Single stack: for `+`/`-`, push signed number. For `*`/`/`, pop top and compute immediately (handles precedence). For `(`, recurse (or save state). For `)`, sum the stack and return. This elegantly handles all three: +/-, */÷, and nesting.",
    approach: "1. Iterate through characters with a stack.\n2. Build numbers. Track last operator.\n3. +/-: push ±num. *//: pop, compute, push result.\n4. (: recurse or push state. ): sum stack, return.\n5. Final answer = sum(stack).",
    solutionPython: `def calculate(s):
    i = 0
    
    def parse():
        nonlocal i
        stack = []
        num = 0
        sign = '+'
        
        while i < len(s):
            ch = s[i]
            
            if ch.isdigit():
                num = num * 10 + int(ch)
            
            if ch == '(':
                i += 1  # skip '('
                num = parse()
            
            if ch in '+-*/)' or i == len(s) - 1:
                if sign == '+':
                    stack.append(num)
                elif sign == '-':
                    stack.append(-num)
                elif sign == '*':
                    stack.append(stack.pop() * num)
                elif sign == '/':
                    stack.append(int(stack.pop() / num))
                
                num = 0
                sign = ch
                
                if ch == ')':
                    i += 1
                    return sum(stack)
            
            i += 1
        
        return sum(stack)
    
    return parse()`,
    solutionCpp: `#include <string>
#include <stack>
using namespace std;

class Solution {
    int i = 0;
    
    int parse(const string& s) {
        stack<int> stk;
        int num = 0;
        char sign = '+';
        
        while (i < (int)s.size()) {
            char ch = s[i];
            
            if (isdigit(ch))
                num = num * 10 + (ch - '0');
            
            if (ch == '(') {
                i++;
                num = parse(s);
            }
            
            if ((!isdigit(ch) && ch != ' ') || i == (int)s.size() - 1) {
                if (sign == '+') stk.push(num);
                else if (sign == '-') stk.push(-num);
                else if (sign == '*') { int t = stk.top(); stk.pop(); stk.push(t * num); }
                else if (sign == '/') { int t = stk.top(); stk.pop(); stk.push(t / num); }
                num = 0;
                sign = ch;
                if (ch == ')') { i++; break; }
            }
            i++;
        }
        
        int result = 0;
        while (!stk.empty()) { result += stk.top(); stk.pop(); }
        return result;
    }
    
public:
    int calculate(string s) {
        return parse(s);
    }
};`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    patternGuide: "Use **recursive descent with stack** when:\n- Expression has both operator precedence AND nesting\n- Combining Calculator I + II patterns\n- Need to handle *, / immediately but defer +, -\n\nSimilar: Basic Calculator I/II, Parse Lisp Expression"
},
{
    id: 126,
    lcNumber: 745,
    title: "Prefix and Suffix Search",
    difficulty: "Hard",
    category: "Trie",
    description: "Design a special dictionary that searches for words by a prefix and a suffix simultaneously. Implement `WordFilter(words)` and `f(pref, suff)` which returns the index of the word with the given prefix and suffix. If multiple words match, return the largest index.",
    examples: [
        "Input: WordFilter([\"apple\"]), f(\"a\", \"e\")\nOutput: 0\nExplanation: \"apple\" has prefix \"a\" and suffix \"e\"."
    ],
    thinkingProcess: [
        { step: "Brute force for each query", detail: "For each query, check all words: does word start with prefix AND end with suffix? Return the largest index. This is O(N × L) per query — too slow." },
        { step: "Approach 1: Precompute all prefix-suffix pairs", detail: "For each word, generate all possible (prefix, suffix) pairs and map them to the word index. But a word of length L has L² such pairs. With many long words, this uses too much memory." },
        { step: "Approach 2: Trie with suffix wrapping", detail: "Key trick: for each word like 'apple', insert all rotations with a separator: 'apple{apple', 'pple{apple', 'ple{apple', 'le{apple', 'e{apple', '{apple' into a trie. To search for prefix='ap', suffix='le', look up 'le{ap' in the trie." },
        { step: "Why the wrapped key works", detail: "The key `suffix + '{' + word` contains the suffix at the start and the full word. Searching for `suffix + '{' + prefix` as a trie prefix matches words that end with `suffix` and start with `prefix`. The `{` separator (ASCII after 'z') prevents false matches." },
        { step: "Store max index at each node", detail: "Since we want the largest index, store the maximum word index at each trie node. When inserting, update max index along the path. Query just reads the max index at the found node." },
        { step: "Trade-off", detail: "This uses O(N × L²) space (for all rotations) but gives O(L) query time. For the given constraints, this is acceptable." }
    ],
    keyInsight: "Insert all suffix rotations of each word into a trie: for word 'apple', insert '{apple', 'e{apple', 'le{apple', ..., 'apple{apple'. To query prefix='ap', suffix='le', search for 'le{ap'. Store max word index at each node for O(L) queries.",
    approach: "1. Build trie with all suffix-wrapped rotations.\n2. Each rotation: `suffix_part + '{' + word`.\n3. Store max index at each trie node.\n4. Query: search `suff + '{' + pref` in trie.",
    solutionPython: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.max_index = -1

class WordFilter:
    def __init__(self, words):
        self.root = TrieNode()
        for idx, word in enumerate(words):
            # Insert all suffix rotations
            wrapped = word + '{' + word
            for i in range(len(word) + 1):
                node = self.root
                key = wrapped[i:]
                for ch in key:
                    if ch not in node.children:
                        node.children[ch] = TrieNode()
                    node = node.children[ch]
                    node.max_index = idx
    
    def f(self, pref, suff):
        node = self.root
        key = suff + '{' + pref
        for ch in key:
            if ch not in node.children:
                return -1
            node = node.children[ch]
        return node.max_index`,
    solutionCpp: `#include <vector>
#include <string>
#include <unordered_map>
using namespace std;

struct TrieNode {
    unordered_map<char, TrieNode*> children;
    int maxIdx = -1;
};

class WordFilter {
    TrieNode* root;
public:
    WordFilter(vector<string>& words) {
        root = new TrieNode();
        for (int idx = 0; idx < (int)words.size(); idx++) {
            string wrapped = words[idx] + "{" + words[idx];
            for (int i = 0; i <= (int)words[idx].size(); i++) {
                TrieNode* node = root;
                for (int j = i; j < (int)wrapped.size(); j++) {
                    char ch = wrapped[j];
                    if (!node->children[ch])
                        node->children[ch] = new TrieNode();
                    node = node->children[ch];
                    node->maxIdx = idx;
                }
            }
        }
    }
    
    int f(string pref, string suff) {
        TrieNode* node = root;
        string key = suff + "{" + pref;
        for (char ch : key) {
            if (!node->children.count(ch)) return -1;
            node = node->children[ch];
        }
        return node->maxIdx;
    }
};`,
    timeComplexity: "O(N × L²) build, O(L) per query",
    spaceComplexity: "O(N × L²)",
    patternGuide: "Use **suffix-wrapped Trie** when:\n- Searching by both prefix AND suffix simultaneously\n- Need to combine forward and backward matching\n- Rotation trick converts dual-ended search to prefix-only\n\nSimilar: Implement Trie, Design Add and Search Words, Stream of Characters"
},
{
    id: 127,
    lcNumber: 780,
    title: "Reaching Points",
    difficulty: "Hard",
    category: "Math / Bit Manipulation",
    description: "Given four integers `sx`, `sy`, `tx`, `ty`, return true if it's possible to transform `(sx, sy)` to `(tx, ty)` using the operations: `(x, y) → (x+y, y)` or `(x, y) → (x, x+y)`.",
    examples: [
        "Input: sx = 1, sy = 1, tx = 3, ty = 5\nOutput: true\nExplanation: (1,1) → (1,2) → (3,2) → (3,5)",
        "Input: sx = 1, sy = 1, tx = 2, ty = 2\nOutput: false",
        "Input: sx = 1, sy = 1, tx = 1, ty = 1\nOutput: true"
    ],
    thinkingProcess: [
        { step: "Forward direction is exponential", detail: "Starting from (sx,sy), each step doubles the possibilities. We'd explore an exponential tree. Working forward is too slow." },
        { step: "Work backwards", detail: "From (tx,ty), the inverse operations are: if `tx > ty`, the previous state was `(tx-ty, ty)`. If `ty > tx`, it was `(tx, ty-tx)`. This is unique (unlike forward which has 2 choices)." },
        { step: "Naive subtraction is slow", detail: "If tx >> ty (e.g., tx=10^9, ty=1), we'd subtract 1 at a time — way too slow. Use modulo: `tx = tx % ty` subtracts ty from tx as many times as possible in one step." },
        { step: "Careful with modulo", detail: "We must stop when tx ≤ sx or ty ≤ sy (can't go below the start). When ty == sy, check if `(tx - sx) % sy == 0` (can reach sx by repeatedly subtracting sy). Similarly when tx == sx." },
        { step: "GCD-like convergence", detail: "This process is like the Euclidean GCD algorithm — at each step, we take modulo of the larger by the smaller. It converges in O(log(max(tx,ty))) steps." },
        { step: "Edge case: tx == ty", detail: "If tx == ty and tx == sx == sy, return true. If tx == ty but not equal to start, check if it's reachable." }
    ],
    keyInsight: "Work backwards from (tx,ty) to (sx,sy). Use modulo (not subtraction) for efficiency: if tx > ty, set tx = tx % ty. Stop when a coordinate matches the start. This mirrors the Euclidean algorithm and runs in O(log(max)) time.",
    approach: "1. Work backwards: while tx > sx and ty > sy.\n2. If tx > ty: tx %= ty. Else: ty %= tx.\n3. When loop ends: check if we've reached (sx,sy).\n4. If tx == sx: check (ty - sy) % sx == 0 and ty >= sy.\n5. If ty == sy: check (tx - sx) % sy == 0 and tx >= sx.",
    solutionPython: `def reachingPoints(sx, sy, tx, ty):
    while tx > sx and ty > sy:
        if tx > ty:
            tx %= ty
        else:
            ty %= tx
    
    if tx == sx and ty == sy:
        return True
    elif tx == sx:
        return ty > sy and (ty - sy) % sx == 0
    elif ty == sy:
        return tx > sx and (tx - sx) % sy == 0
    else:
        return False`,
    solutionCpp: `bool reachingPoints(int sx, int sy, int tx, int ty) {
    while (tx > sx && ty > sy) {
        if (tx > ty) tx %= ty;
        else ty %= tx;
    }
    
    if (tx == sx && ty == sy) return true;
    if (tx == sx) return ty > sy && (ty - sy) % sx == 0;
    if (ty == sy) return tx > sx && (tx - sx) % sy == 0;
    return false;
}`,
    timeComplexity: "O(log(max(tx, ty)))",
    spaceComplexity: "O(1)",
    patternGuide: "Use **reverse + modulo (GCD-like)** when:\n- Forward direction branches exponentially but backward is unique\n- Repeated subtraction can be replaced by modulo\n- The process mirrors the Euclidean algorithm\n\nSimilar: Broken Calculator, Water and Jug Problem"
},
{
    id: 128,
    lcNumber: 943,
    title: "Find the Shortest Superstring",
    difficulty: "Hard",
    category: "Dynamic Programming",
    description: "Given an array of strings `words`, return the shortest string that contains each string in `words` as a substring. If there are multiple, return any.",
    examples: [
        "Input: words = [\"alex\",\"loves\",\"leetcode\"]\nOutput: \"alexlovesleetcode\"",
        "Input: words = [\"catg\",\"ctaagt\",\"gcta\",\"ttca\",\"atgcatc\"]\nOutput: \"gctaagttcatgcatc\""
    ],
    thinkingProcess: [
        { step: "This is the Shortest Superstring Problem", detail: "A classic NP-hard problem related to the Traveling Salesman Problem. We need to find the optimal ordering of words to maximize overlaps." },
        { step: "Precompute overlaps", detail: "For each pair (i, j), compute the overlap: the longest suffix of words[i] that is a prefix of words[j]. Store in an overlap matrix. This tells us how many characters we save by placing j after i." },
        { step: "DP with bitmask", detail: "State: `dp[mask][i]` = minimum superstring length when we've used the words in `mask` and the last word used is `i`. Transition: try adding any unused word `j`, cost = `len(words[j]) - overlap[i][j]`." },
        { step: "Reconstruct the string", detail: "Track parent pointers: `parent[mask][i]` = which word came before `i` in the optimal solution. After filling DP, trace back to reconstruct the ordering." },
        { step: "Build the superstring", detail: "From the optimal ordering, build the string: start with the first word, then for each subsequent word, append only the non-overlapping suffix." },
        { step: "Complexity", detail: "n words, 2^n subsets, O(n) transitions = O(n² × 2^n). Since n ≤ 12, this is about 12² × 4096 ≈ 590K — very fast." }
    ],
    keyInsight: "NP-hard but solvable with bitmask DP since n ≤ 12. Precompute overlap between all word pairs. DP state: (set of used words, last word) → minimum total length. Track parent pointers to reconstruct the optimal ordering and build the superstring.",
    approach: "1. Precompute overlap[i][j] for all pairs.\n2. Bitmask DP: `dp[mask][i]` = best cost with `mask` used, `i` last.\n3. Transition: add word `j`, cost = `len(j) - overlap[i][j]`.\n4. Find optimal end state, backtrack to recover ordering.\n5. Build superstring from ordering.",
    solutionPython: `def shortestSuperstring(words):
    n = len(words)
    
    # Precompute overlaps
    overlap = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            if i == j: continue
            m = min(len(words[i]), len(words[j]))
            for k in range(m, 0, -1):
                if words[i][-k:] == words[j][:k]:
                    overlap[i][j] = k
                    break
    
    # DP with bitmask
    FULL = (1 << n) - 1
    dp = [[0] * n for _ in range(1 << n)]
    parent = [[-1] * n for _ in range(1 << n)]
    
    for mask in range(1 << n):
        for i in range(n):
            if not (mask & (1 << i)): continue
            for j in range(n):
                if mask & (1 << j): continue
                new_mask = mask | (1 << j)
                val = dp[mask][i] + overlap[i][j]
                if val > dp[new_mask][j]:
                    dp[new_mask][j] = val
                    parent[new_mask][j] = i
    
    # Find best ending word
    best_last = max(range(n), key=lambda i: dp[FULL][i])
    
    # Reconstruct ordering
    order = []
    mask = FULL
    cur = best_last
    while cur != -1:
        order.append(cur)
        prev = parent[mask][cur]
        mask ^= (1 << cur)
        cur = prev
    order.reverse()
    
    # Build superstring
    result = words[order[0]]
    for i in range(1, len(order)):
        ov = overlap[order[i-1]][order[i]]
        result += words[order[i]][ov:]
    
    return result`,
    solutionCpp: `#include <vector>
#include <string>
using namespace std;

string shortestSuperstring(vector<string>& words) {
    int n = words.size();
    vector<vector<int>> ov(n, vector<int>(n, 0));
    
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++) if (i != j) {
            int m = min(words[i].size(), words[j].size());
            for (int k = m; k > 0; k--)
                if (words[i].substr(words[i].size()-k) == words[j].substr(0,k)) {
                    ov[i][j] = k; break;
                }
        }
    
    int FULL = (1 << n) - 1;
    vector<vector<int>> dp(1<<n, vector<int>(n, 0));
    vector<vector<int>> par(1<<n, vector<int>(n, -1));
    
    for (int mask = 0; mask <= FULL; mask++)
        for (int i = 0; i < n; i++) {
            if (!(mask & (1<<i))) continue;
            for (int j = 0; j < n; j++) {
                if (mask & (1<<j)) continue;
                int nm = mask | (1<<j);
                int val = dp[mask][i] + ov[i][j];
                if (val > dp[nm][j]) {
                    dp[nm][j] = val;
                    par[nm][j] = i;
                }
            }
        }
    
    int last = 0;
    for (int i = 1; i < n; i++)
        if (dp[FULL][i] > dp[FULL][last]) last = i;
    
    vector<int> order;
    int mask = FULL, cur = last;
    while (cur != -1) {
        order.push_back(cur);
        int prev = par[mask][cur];
        mask ^= (1<<cur);
        cur = prev;
    }
    reverse(order.begin(), order.end());
    
    string res = words[order[0]];
    for (int i = 1; i < (int)order.size(); i++)
        res += words[order[i]].substr(ov[order[i-1]][order[i]]);
    return res;
}`,
    timeComplexity: "O(n² × 2^n)",
    spaceComplexity: "O(n × 2^n)",
    patternGuide: "Use **bitmask DP (TSP variant)** when:\n- Finding optimal ordering/permutation of n items (n ≤ ~20)\n- Each pair has a transition cost\n- Problem is NP-hard but small n allows exponential DP\n\nSimilar: Traveling Salesman, Minimum Cost to Visit Every Node, Parallel Courses II"
},
{
    id: 129,
    lcNumber: 968,
    title: "Binary Tree Cameras",
    difficulty: "Hard",
    category: "Trees",
    description: "You are given the root of a binary tree. We install cameras on nodes. Each camera can monitor its parent, itself, and its immediate children. Return the minimum number of cameras needed to monitor all nodes.",
    examples: [
        "Input: root = [0,0,null,0,0]\nOutput: 1\nExplanation: One camera at root's left child monitors all 4 nodes.",
        "Input: root = [0,0,null,0,null,0,null,null,0]\nOutput: 2"
    ],
    thinkingProcess: [
        { step: "Greedy from leaves upward", detail: "Cameras have a radius of 1 (covers parent + children). Placing a camera at a leaf wastes coverage (leaf has no children). Better to place cameras at parents of leaves — they cover more." },
        { step: "Three states per node", detail: "After DFS, each node is in one of 3 states:\n- State 0: NOT monitored (needs a camera from parent)\n- State 1: Monitored but NO camera here\n- State 2: Has a CAMERA" },
        { step: "Post-order DFS", detail: "Process children first (bottom-up). Based on children's states, decide this node's state:\n- If any child is NOT monitored (state 0) → must place camera here (state 2)\n- If any child HAS camera (state 2) → this node is monitored (state 1)\n- Otherwise → this node is NOT monitored (state 0), hope parent covers it" },
        { step: "Root special case", detail: "After DFS, if root is state 0 (not monitored), it has no parent to cover it — must place a camera at root." },
        { step: "Null nodes", detail: "Null children should return state 1 (monitored). Why? If null returned state 0, we'd have to place a camera at every leaf. Returning state 1 means 'covered, no camera needed here.'" },
        { step: "Why greedy works", detail: "By delaying camera placement as high as possible (only placing when forced by an unmonitored child), we maximize each camera's coverage. Exchange argument: any solution with a lower camera can be rearranged to match ours." }
    ],
    keyInsight: "Greedy bottom-up: leaves should NOT have cameras (waste coverage). Use post-order DFS with 3 states: 0=not monitored, 1=monitored, 2=has camera. Place camera only when forced (child unmonitored). Null nodes return 'monitored' to avoid cameras on every leaf.",
    approach: "1. Post-order DFS returning state (0, 1, or 2).\n2. Null → state 1 (monitored).\n3. If any child is state 0 → place camera (state 2), increment count.\n4. If any child is state 2 → state 1 (monitored by child).\n5. Otherwise → state 0 (not monitored, need parent).\n6. If root is state 0, add one more camera.",
    solutionPython: `def minCameraCover(root):
    cameras = 0
    
    def dfs(node):
        nonlocal cameras
        if not node:
            return 1  # null = monitored
        
        left = dfs(node.left)
        right = dfs(node.right)
        
        # If any child is NOT monitored, must place camera here
        if left == 0 or right == 0:
            cameras += 1
            return 2
        
        # If any child has a camera, this node is monitored
        if left == 2 or right == 2:
            return 1
        
        # Both children are monitored but no camera nearby
        return 0
    
    if dfs(root) == 0:
        cameras += 1
    
    return cameras`,
    solutionCpp: `struct TreeNode { int val; TreeNode *left, *right; };

class Solution {
    int cameras = 0;
    
    // 0 = not monitored, 1 = monitored, 2 = has camera
    int dfs(TreeNode* node) {
        if (!node) return 1;
        
        int left = dfs(node->left);
        int right = dfs(node->right);
        
        if (left == 0 || right == 0) {
            cameras++;
            return 2;
        }
        if (left == 2 || right == 2) return 1;
        return 0;
    }
    
public:
    int minCameraCover(TreeNode* root) {
        if (dfs(root) == 0) cameras++;
        return cameras;
    }
};`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(h) — recursion depth",
    patternGuide: "Use **greedy bottom-up with state** when:\n- Covering/dominating set problems on trees\n- Each node decision depends on children's states\n- Placing resources to cover neighbors optimally\n\nSimilar: Distribute Coins in Binary Tree, House Robber III, Minimum Vertex Cover"
},
{
    id: 130,
    lcNumber: 1293,
    title: "Shortest Path in a Grid with Obstacles Elimination",
    difficulty: "Hard",
    category: "Graph BFS/DFS",
    description: "You are given an `m x n` grid where 0 = empty and 1 = obstacle. You can move up/down/left/right and can eliminate at most `k` obstacles. Return the minimum number of steps to walk from `(0,0)` to `(m-1,n-1)`, or -1 if not possible.",
    examples: [
        "Input: grid = [[0,0,0],[1,1,0],[0,0,0],[0,1,1],[0,0,0]], k = 1\nOutput: 6\nExplanation: Shortest path with at most 1 elimination is 6 steps.",
        "Input: grid = [[0,1,1],[1,1,1],[1,0,0]], k = 1\nOutput: -1"
    ],
    thinkingProcess: [
        { step: "BFS but with an extra dimension", detail: "Standard BFS finds shortest path, but here we have a 'budget' of k eliminations. The state isn't just (row, col) but (row, col, remaining_eliminations). Same cell with different remaining k's are different states." },
        { step: "3D visited array", detail: "Visit state `(r, c, remaining_k)`. If we arrive at the same cell with more remaining eliminations, that's a new state worth exploring (more flexibility for future obstacles)." },
        { step: "BFS with augmented state", detail: "Queue contains `(row, col, remaining_k, steps)`. For each state, try all 4 directions. If the neighbor is an obstacle and remaining_k > 0, move there with remaining_k - 1. If empty, move with same remaining_k." },
        { step: "Optimization: early termination", detail: "If `k >= m + n - 3`, we can always go in a straight line (Manhattan distance). Return `m + n - 2` immediately." },
        { step: "Why BFS gives shortest path", detail: "BFS explores states in order of increasing steps. The first time we reach `(m-1, n-1)` with any remaining k, that's the shortest path." },
        { step: "Complexity", detail: "States: m × n × (k+1). Each state has 4 transitions. Total: O(m × n × k). With the early termination optimization, k is bounded by m+n." }
    ],
    keyInsight: "BFS with state `(row, col, remaining_eliminations)`. Standard BFS but with an extra dimension tracking the obstacle elimination budget. First time reaching the target in ANY state is the shortest path. Key optimization: if k ≥ m+n-3, return Manhattan distance directly.",
    approach: "1. BFS with state (row, col, remaining_k).\n2. 3D visited array.\n3. On obstacle: use one elimination if budget allows.\n4. First arrival at (m-1, n-1) = answer.\n5. Optimize: if k ≥ m+n-3, return m+n-2.",
    solutionPython: `from collections import deque

def shortestPath(grid, k):
    m, n = len(grid), len(grid[0])
    
    # Optimization: if k is large enough, just go Manhattan
    if k >= m + n - 3:
        return m + n - 2
    
    # BFS: (row, col, remaining_k)
    queue = deque([(0, 0, k, 0)])
    visited = set()
    visited.add((0, 0, k))
    
    while queue:
        r, c, rem, steps = queue.popleft()
        
        if r == m - 1 and c == n - 1:
            return steps
        
        for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n:
                nk = rem - grid[nr][nc]
                if nk >= 0 and (nr, nc, nk) not in visited:
                    visited.add((nr, nc, nk))
                    queue.append((nr, nc, nk, steps + 1))
    
    return -1`,
    solutionCpp: `#include <vector>
#include <queue>
using namespace std;

int shortestPath(vector<vector<int>>& grid, int k) {
    int m = grid.size(), n = grid[0].size();
    if (k >= m + n - 3) return m + n - 2;
    
    // visited[r][c][rem_k]
    vector<vector<vector<bool>>> vis(m, vector<vector<bool>>(n, vector<bool>(k+1, false)));
    queue<tuple<int,int,int,int>> q;
    q.push({0, 0, k, 0});
    vis[0][0][k] = true;
    
    int dirs[][2] = {{-1,0},{1,0},{0,-1},{0,1}};
    
    while (!q.empty()) {
        auto [r, c, rem, steps] = q.front(); q.pop();
        if (r == m-1 && c == n-1) return steps;
        
        for (auto& d : dirs) {
            int nr = r+d[0], nc = c+d[1];
            if (nr<0||nr>=m||nc<0||nc>=n) continue;
            int nk = rem - grid[nr][nc];
            if (nk >= 0 && !vis[nr][nc][nk]) {
                vis[nr][nc][nk] = true;
                q.push({nr, nc, nk, steps+1});
            }
        }
    }
    return -1;
}`,
    timeComplexity: "O(m × n × k)",
    spaceComplexity: "O(m × n × k)",
    patternGuide: "Use **BFS with extra state dimension** when:\n- Standard BFS but with a limited resource/budget\n- Same position with different resource levels = different states\n- Finding shortest path with constraints\n\nSimilar: Cheapest Flights Within K Stops, Minimum Cost to Make at Least One Valid Path"
},
{
    id: 131,
    lcNumber: 1032,
    title: "Stream of Characters",
    difficulty: "Hard",
    category: "Trie",
    description: "Design an algorithm that accepts a stream of characters and checks if a suffix of the characters so far is a string in a given list of words. Implement `StreamChecker(words)` and `query(letter)` that returns true if any suffix of the characters queried so far is in `words`.",
    examples: [
        "Input: StreamChecker([\"cd\",\"f\",\"kl\"])\n  query('a') → false\n  query('b') → false\n  query('c') → false\n  query('d') → true (\"cd\" is a suffix)\n  query('e') → false\n  query('f') → true (\"f\" is a suffix)"
    ],
    thinkingProcess: [
        { step: "Suffix matching problem", detail: "At each query, we need to check if any word matches as a suffix of the stream so far. Checking all words against the stream is too slow." },
        { step: "Reverse the words into a Trie", detail: "Key insight: build a Trie of the REVERSED words. Then for each query, traverse the Trie using the stream characters in REVERSE order (most recent first). If we hit a word ending, a suffix matches." },
        { step: "Maintain the stream", detail: "Keep a buffer of all queried characters. On each query, append the new character. Then walk the reversed-word Trie from the newest character backwards." },
        { step: "Optimization: limit traversal", detail: "We only need to check up to the length of the longest word. So keep a buffer of at most `maxWordLength` characters. Traverse at most that many nodes in the Trie." },
        { step: "Trie traversal per query", detail: "For each new character, start at the Trie root. Go through stream characters from newest to oldest: stream[-1], stream[-2], .... At each step, follow the corresponding child in the Trie. If we hit a word end → return true. If we fall off the Trie → return false." },
        { step: "Complexity", detail: "Build: O(total characters in words). Each query: O(min(stream length, maxWordLength)). With the length limit, each query is O(maxWordLength)." }
    ],
    keyInsight: "Build a Trie of REVERSED words. On each query, append the character to a buffer and traverse the Trie from newest to oldest character. If any word ending is reached, a word matches as a suffix. Limit traversal to the longest word length.",
    approach: "1. Reverse each word and insert into Trie.\n2. Maintain stream buffer (or deque).\n3. On query: append char, traverse Trie from stream end backwards.\n4. Return true if word end found.",
    solutionPython: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False

class StreamChecker:
    def __init__(self, words):
        self.root = TrieNode()
        self.stream = []
        self.max_len = 0
        
        for word in words:
            self.max_len = max(self.max_len, len(word))
            node = self.root
            for ch in reversed(word):
                if ch not in node.children:
                    node.children[ch] = TrieNode()
                node = node.children[ch]
            node.is_word = True
    
    def query(self, letter):
        self.stream.append(letter)
        
        node = self.root
        # Check stream in reverse
        for i in range(len(self.stream) - 1,
                       max(-1, len(self.stream) - self.max_len - 1), -1):
            ch = self.stream[i]
            if ch not in node.children:
                return False
            node = node.children[ch]
            if node.is_word:
                return True
        
        return False`,
    solutionCpp: `#include <vector>
#include <string>
using namespace std;

struct TrieNode {
    TrieNode* children[26] = {};
    bool isWord = false;
};

class StreamChecker {
    TrieNode* root;
    string stream;
    int maxLen = 0;
    
public:
    StreamChecker(vector<string>& words) {
        root = new TrieNode();
        for (auto& w : words) {
            maxLen = max(maxLen, (int)w.size());
            TrieNode* node = root;
            for (int i = w.size()-1; i >= 0; i--) {
                int c = w[i] - 'a';
                if (!node->children[c])
                    node->children[c] = new TrieNode();
                node = node->children[c];
            }
            node->isWord = true;
        }
    }
    
    bool query(char letter) {
        stream += letter;
        TrieNode* node = root;
        int start = max(0, (int)stream.size() - maxLen);
        for (int i = stream.size()-1; i >= start; i--) {
            int c = stream[i] - 'a';
            if (!node->children[c]) return false;
            node = node->children[c];
            if (node->isWord) return true;
        }
        return false;
    }
};`,
    timeComplexity: "O(maxWordLength) per query",
    spaceComplexity: "O(total chars in words + stream length)",
    patternGuide: "Use **reversed-word Trie** for stream suffix matching:\n- Build Trie of reversed dictionary words\n- On each new char, traverse Trie from newest to oldest\n- Naturally matches suffixes of the stream\n\nSimilar: Design Add and Search Words, Implement Trie"
},
{
    id: 132,
    lcNumber: 1000,
    title: "Minimum Cost to Merge Stones",
    difficulty: "Hard",
    category: "Dynamic Programming",
    description: "There are `n` piles of stones in a row. In each move, you merge `k` consecutive piles into one pile, and the cost is the total number of stones in those k piles. Return the minimum cost to merge all piles into one pile. If impossible, return -1.",
    examples: [
        "Input: stones = [3,2,4,1], k = 2\nOutput: 20\nExplanation: Merge [3,2]→5 (cost 5), [4,1]→5 (cost 5), [5,5]→10 (cost 10). Total: 20.",
        "Input: stones = [3,2,4,1], k = 3\nOutput: -1\nExplanation: Can't merge 4 piles with k=3."
    ],
    thinkingProcess: [
        { step: "When is it possible?", detail: "Each merge reduces pile count by k-1. Starting with n piles, after some merges we need exactly 1. So we need `(n-1) % (k-1) == 0`. If not, return -1." },
        { step: "Interval DP", detail: "Define `dp[i][j]` = minimum cost to merge piles `i..j` into as few piles as possible. We can first think of `dp[i][j][m]` = cost to reduce `i..j` into exactly `m` piles." },
        { step: "Simplified formulation", detail: "Actually, `dp[i][j]` = min cost to optimally process range `i..j`. If the range can be merged into 1 pile (i.e., `(j-i) % (k-1) == 0`), add the merge cost = `prefix_sum[j+1] - prefix_sum[i]`." },
        { step: "Recurrence", detail: "`dp[i][j] = min over all split points m: dp[i][m] + dp[m+1][j]` where we step m by k-1 (since left part must reduce to 1 pile). Then if `(j-i)%(k-1)==0`, add `sum(i..j)` for the final merge." },
        { step: "Why step by k-1", detail: "The left subrange `i..m` must form exactly 1 pile. For that, `(m-i) % (k-1) == 0`. So m = i, i+(k-1), i+2(k-1), .... This is the split point iteration." },
        { step: "Base and prefix sums", detail: "Base: `dp[i][i] = 0` (single pile, no merge needed). Use prefix sums for range sum queries." }
    ],
    keyInsight: "Interval DP where `dp[i][j]` = min cost to process range. Split at points `m = i, i+(k-1), i+2(k-1),...` (ensuring left part merges to 1 pile). If the full range can merge to 1 pile, add `sum(i..j)`. Feasibility check: `(n-1) % (k-1) == 0`.",
    approach: "1. Check feasibility: `(n-1) % (k-1) == 0`.\n2. Compute prefix sums.\n3. Interval DP: iterate by length, then start, then split point.\n4. Split at m where `(m-i) % (k-1) == 0`.\n5. If `(j-i) % (k-1) == 0`, add range sum.",
    solutionPython: `def mergeStones(stones, k):
    n = len(stones)
    if (n - 1) % (k - 1) != 0:
        return -1
    
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + stones[i]
    
    def range_sum(i, j):
        return prefix[j + 1] - prefix[i]
    
    INF = float('inf')
    dp = [[0] * n for _ in range(n)]
    
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = INF
            for m in range(i, j, k - 1):
                dp[i][j] = min(dp[i][j], dp[i][m] + dp[m+1][j])
            
            if (j - i) % (k - 1) == 0:
                dp[i][j] += range_sum(i, j)
    
    return dp[0][n - 1]`,
    solutionCpp: `#include <vector>
#include <climits>
using namespace std;

int mergeStones(vector<int>& stones, int k) {
    int n = stones.size();
    if ((n - 1) % (k - 1) != 0) return -1;
    
    vector<int> prefix(n + 1, 0);
    for (int i = 0; i < n; i++) prefix[i+1] = prefix[i] + stones[i];
    
    vector<vector<int>> dp(n, vector<int>(n, 0));
    
    for (int len = 2; len <= n; len++) {
        for (int i = 0; i <= n - len; i++) {
            int j = i + len - 1;
            dp[i][j] = INT_MAX;
            for (int m = i; m < j; m += k - 1)
                dp[i][j] = min(dp[i][j], dp[i][m] + dp[m+1][j]);
            if ((j - i) % (k - 1) == 0)
                dp[i][j] += prefix[j+1] - prefix[i];
        }
    }
    return dp[0][n-1];
}`,
    timeComplexity: "O(n³ / k)",
    spaceComplexity: "O(n²)",
    patternGuide: "Use **interval DP with k-way merge** when:\n- Merging consecutive elements with a cost\n- Optimal substructure over contiguous ranges\n- Merge factor k generalizes matrix chain multiplication\n\nSimilar: Burst Balloons, Matrix Chain Multiplication, Strange Printer"
},
{
    id: 133,
    lcNumber: 1095,
    title: "Find in Mountain Array",
    difficulty: "Hard",
    category: "Binary Search",
    description: "A mountain array has values that strictly increase then strictly decrease. You can't access the array directly — only via `MountainArray.get(index)` and `MountainArray.length()`. Given a `target`, return the minimum index where `target` exists, or -1. You may call `get` at most 100 times.",
    examples: [
        "Input: array = [1,2,3,4,5,3,1], target = 3\nOutput: 2\nExplanation: 3 appears at index 2 and 5. Minimum index is 2.",
        "Input: array = [0,1,2,4,2,1], target = 3\nOutput: -1"
    ],
    thinkingProcess: [
        { step: "Three binary searches", detail: "A mountain array has an ascending part and a descending part, separated by the peak. Strategy: (1) Find the peak, (2) Binary search the ascending side, (3) If not found, binary search the descending side." },
        { step: "Find the peak", detail: "Binary search for the peak: if `arr[mid] < arr[mid+1]`, the peak is to the right (ascending). If `arr[mid] > arr[mid+1]`, the peak is to the left (descending). This finds the peak in O(log n)." },
        { step: "Search ascending side first", detail: "Standard binary search on `arr[0..peak]`. If target is found, return the index (it's the minimum since ascending comes first)." },
        { step: "Search descending side", detail: "If not found ascending, binary search `arr[peak+1..n-1]` in REVERSE order (since it's descending, flip the comparison: if `arr[mid] > target`, go right)." },
        { step: "Minimize API calls", detail: "Total calls: O(log n) for peak + O(log n) for ascending + O(log n) for descending = O(3 × log n). For n = 10^4, that's about 42 calls — well within the 100 limit." },
        { step: "Cache get() calls", detail: "Since `get()` is expensive and limited, cache results to avoid redundant calls. A dictionary mapping index → value works." }
    ],
    keyInsight: "Three binary searches: (1) Find the peak using binary search. (2) Search ascending side for target. (3) If not found, search descending side. Search ascending first to guarantee minimum index. Total: O(log n) API calls.",
    approach: "1. Binary search to find peak index.\n2. Binary search ascending part (0..peak) for target.\n3. If found, return index. If not, binary search descending part.\n4. Cache get() calls to minimize API usage.",
    solutionPython: `def findInMountainArray(target, mountain_arr):
    n = mountain_arr.length()
    
    # Step 1: Find peak
    lo, hi = 0, n - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if mountain_arr.get(mid) < mountain_arr.get(mid + 1):
            lo = mid + 1
        else:
            hi = mid
    peak = lo
    
    # Step 2: Binary search ascending side
    lo, hi = 0, peak
    while lo <= hi:
        mid = (lo + hi) // 2
        val = mountain_arr.get(mid)
        if val == target:
            return mid
        elif val < target:
            lo = mid + 1
        else:
            hi = mid - 1
    
    # Step 3: Binary search descending side
    lo, hi = peak + 1, n - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        val = mountain_arr.get(mid)
        if val == target:
            return mid
        elif val > target:
            lo = mid + 1
        else:
            hi = mid - 1
    
    return -1`,
    solutionCpp: `class Solution {
public:
    int findInMountainArray(int target, MountainArray &arr) {
        int n = arr.length();
        
        // Find peak
        int lo = 0, hi = n - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (arr.get(mid) < arr.get(mid + 1)) lo = mid + 1;
            else hi = mid;
        }
        int peak = lo;
        
        // Search ascending
        lo = 0; hi = peak;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            int val = arr.get(mid);
            if (val == target) return mid;
            else if (val < target) lo = mid + 1;
            else hi = mid - 1;
        }
        
        // Search descending
        lo = peak + 1; hi = n - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            int val = arr.get(mid);
            if (val == target) return mid;
            else if (val > target) lo = mid + 1;
            else hi = mid - 1;
        }
        
        return -1;
    }
};`,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    patternGuide: "Use **multi-phase binary search** when:\n- Array has two sorted regions (ascending + descending)\n- Need to find peak/valley first, then search\n- Limited API calls require efficient access\n\nSimilar: Peak Element, Search in Rotated Sorted Array, Bitonic Search"
},
{
    id: 134,
    lcNumber: 352,
    title: "Data Stream as Disjoint Intervals",
    difficulty: "Hard",
    category: "Design",
    description: "Given a data stream of non-negative integers, implement a class that summarizes the numbers seen so far as a list of disjoint intervals. Implement `SummaryRanges()`, `addNum(value)`, and `getIntervals()`.",
    examples: [
        "addNum(1) → [[1,1]]\naddNum(3) → [[1,1],[3,3]]\naddNum(7) → [[1,1],[3,3],[7,7]]\naddNum(2) → [[1,3],[7,7]] (1,2,3 merge)\naddNum(6) → [[1,3],[6,7]]"
    ],
    thinkingProcess: [
        { step: "Maintain sorted intervals", detail: "Keep intervals sorted by start. When adding a number, find where it falls relative to existing intervals and merge if adjacent or overlapping." },
        { step: "Cases when adding num", detail: "1. `num` falls inside an existing interval → do nothing.\n2. `num` is adjacent to one interval → extend it.\n3. `num` bridges two intervals → merge them.\n4. `num` is isolated → create new [num, num]." },
        { step: "Efficient lookup", detail: "Use binary search (or a TreeMap/SortedList) to find the interval just before and just after `num`. Check if `num` should merge with either or both." },
        { step: "Using a TreeMap approach", detail: "Store intervals as `start → end` in a sorted map. To add `num`: find the interval with the largest start ≤ num. Check if num is already covered. Then check if num extends it or merges with the next interval." },
        { step: "Merge logic", detail: "If `prev.end >= num - 1` and `next.start <= num + 1`: merge prev and next into one interval. If only prev extends: `prev.end = max(prev.end, num)`. If only next merges: new interval `[num, next.end]`, remove old next." },
        { step: "getIntervals", detail: "Simply return all intervals in sorted order — already maintained by the data structure." }
    ],
    keyInsight: "Maintain a sorted map of start→end intervals. On addNum, binary search for the adjacent intervals. Check four cases: already covered, extend left, extend right, or bridge two intervals. TreeMap/SortedList gives O(log n) insertions.",
    approach: "1. Sorted map: start → end.\n2. addNum: find floor/ceiling intervals via binary search.\n3. Check merge/extend cases.\n4. getIntervals: return sorted intervals.",
    solutionPython: `from sortedcontainers import SortedDict

class SummaryRanges:
    def __init__(self):
        self.intervals = SortedDict()
    
    def addNum(self, value):
        ivs = self.intervals
        idx = ivs.bisect_right(value)
        
        # Check if value is inside an existing interval
        if idx > 0:
            prev_start = ivs.keys()[idx - 1]
            prev_end = ivs[prev_start]
            if prev_start <= value <= prev_end:
                return  # already covered
        
        # Check merge with prev and next
        merge_left = (idx > 0 and ivs.values()[idx-1] >= value - 1)
        merge_right = (idx < len(ivs) and ivs.keys()[idx] <= value + 1)
        
        if merge_left and merge_right:
            prev_start = ivs.keys()[idx - 1]
            next_start = ivs.keys()[idx]
            new_end = ivs[next_start]
            ivs[prev_start] = new_end
            del ivs[next_start]
        elif merge_left:
            prev_start = ivs.keys()[idx - 1]
            ivs[prev_start] = max(ivs[prev_start], value)
        elif merge_right:
            next_start = ivs.keys()[idx]
            next_end = ivs[next_start]
            del ivs[next_start]
            ivs[value] = next_end
        else:
            ivs[value] = value
    
    def getIntervals(self):
        return [[k, v] for k, v in self.intervals.items()]`,
    solutionCpp: `#include <map>
#include <vector>
using namespace std;

class SummaryRanges {
    map<int, int> ivs; // start -> end
    
public:
    void addNum(int val) {
        auto it = ivs.upper_bound(val);
        
        // Check if already covered
        if (it != ivs.begin()) {
            auto prev = std::prev(it);
            if (prev->second >= val) return;
        }
        
        bool mergeLeft = (it != ivs.begin() && prev(it)->second >= val - 1);
        bool mergeRight = (it != ivs.end() && it->first <= val + 1);
        
        if (mergeLeft && mergeRight) {
            auto p = std::prev(it);
            p->second = it->second;
            ivs.erase(it);
        } else if (mergeLeft) {
            auto p = std::prev(it);
            p->second = max(p->second, val);
        } else if (mergeRight) {
            int end = it->second;
            ivs.erase(it);
            ivs[val] = end;
        } else {
            ivs[val] = val;
        }
    }
    
    vector<vector<int>> getIntervals() {
        vector<vector<int>> result;
        for (auto& [s, e] : ivs)
            result.push_back({s, e});
        return result;
    }
};`,
    timeComplexity: "O(log n) per addNum, O(n) for getIntervals",
    spaceComplexity: "O(n)",
    patternGuide: "Use **sorted map for interval tracking** when:\n- Dynamic insertion into maintained interval set\n- Need merge/split operations on intervals\n- Range queries on covered regions\n\nSimilar: Range Module, My Calendar, Count Integers in Intervals"
},
{
    id: 135,
    lcNumber: 432,
    title: "All O'one Data Structure",
    difficulty: "Hard",
    category: "Design",
    description: "Design a data structure to store string counts with O(1) operations: `inc(key)` increments count of key, `dec(key)` decrements (removes if 0), `getMaxKey()` returns a key with max count, `getMinKey()` returns a key with min count.",
    examples: [
        "inc(\"hello\"), inc(\"hello\")\ngetMaxKey() → \"hello\"\ngetMinKey() → \"hello\"\ninc(\"leet\")\ngetMaxKey() → \"hello\"\ngetMinKey() → \"leet\""
    ],
    thinkingProcess: [
        { step: "Need O(1) for everything", detail: "HashMap alone gives O(1) inc/dec but O(n) for max/min. We need a structure that tracks the ordering of counts AND allows moving keys between count levels in O(1)." },
        { step: "Doubly linked list of count buckets", detail: "Maintain a doubly linked list where each node represents a count value. Each node holds all keys with that count. The list is sorted by count: min at head, max at tail." },
        { step: "HashMap for O(1) key lookup", detail: "Map: key → pointer to its bucket node. This lets us find which count-bucket a key is in instantly." },
        { step: "Inc operation", detail: "Find key's current bucket (via hashmap). Move key to the next bucket (count+1). If next bucket doesn't exist, create it between current and current.next. If current bucket is now empty, remove it." },
        { step: "Dec operation", detail: "Similar: move key to previous bucket (count-1). If count becomes 0, remove from all structures. Create/remove buckets as needed." },
        { step: "getMax/getMin", detail: "Just read the tail/head of the doubly linked list. O(1). Return any key from that bucket." }
    ],
    keyInsight: "Doubly linked list of 'count buckets' (each node = a count value + set of keys with that count), sorted by count. HashMap maps key → bucket pointer. Inc/dec moves keys between adjacent buckets in O(1). Head = min, tail = max.",
    approach: "1. Doubly linked list of count nodes.\n2. HashMap: key → count node.\n3. Inc: move key to next count node.\n4. Dec: move key to prev count node.\n5. getMax: read list tail. getMin: read list head.",
    solutionPython: `class Node:
    def __init__(self, count=0):
        self.count = count
        self.keys = set()
        self.prev = None
        self.next = None

class AllOne:
    def __init__(self):
        self.head = Node(0)  # sentinel min
        self.tail = Node(float('inf'))  # sentinel max
        self.head.next = self.tail
        self.tail.prev = self.head
        self.key_to_node = {}
    
    def _insert_after(self, node, new_node):
        new_node.prev = node
        new_node.next = node.next
        node.next.prev = new_node
        node.next = new_node
    
    def _remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev
    
    def inc(self, key):
        if key in self.key_to_node:
            node = self.key_to_node[key]
            new_count = node.count + 1
            # Get or create next bucket
            if node.next.count != new_count:
                new_node = Node(new_count)
                self._insert_after(node, new_node)
            else:
                new_node = node.next
            new_node.keys.add(key)
            node.keys.discard(key)
            self.key_to_node[key] = new_node
            if not node.keys:
                self._remove(node)
        else:
            # New key with count 1
            if self.head.next.count != 1:
                new_node = Node(1)
                self._insert_after(self.head, new_node)
            else:
                new_node = self.head.next
            new_node.keys.add(key)
            self.key_to_node[key] = new_node
    
    def dec(self, key):
        if key not in self.key_to_node:
            return
        node = self.key_to_node[key]
        node.keys.discard(key)
        if node.count == 1:
            del self.key_to_node[key]
        else:
            new_count = node.count - 1
            if node.prev.count != new_count:
                new_node = Node(new_count)
                self._insert_after(node.prev, new_node)
            else:
                new_node = node.prev
            new_node.keys.add(key)
            self.key_to_node[key] = new_node
        if not node.keys:
            self._remove(node)
    
    def getMaxKey(self):
        if self.tail.prev == self.head:
            return ""
        return next(iter(self.tail.prev.keys))
    
    def getMinKey(self):
        if self.head.next == self.tail:
            return ""
        return next(iter(self.head.next.keys))`,
    solutionCpp: `#include <string>
#include <unordered_map>
#include <unordered_set>
#include <list>
using namespace std;

struct Bucket {
    int count;
    unordered_set<string> keys;
};

class AllOne {
    list<Bucket> buckets;
    unordered_map<string, list<Bucket>::iterator> keyMap;
    
public:
    void inc(string key) {
        if (keyMap.count(key)) {
            auto it = keyMap[key];
            int nc = it->count + 1;
            auto nxt = next(it);
            if (nxt == buckets.end() || nxt->count != nc)
                nxt = buckets.insert(nxt, {nc, {}});
            nxt->keys.insert(key);
            keyMap[key] = nxt;
            it->keys.erase(key);
            if (it->keys.empty()) buckets.erase(it);
        } else {
            if (buckets.empty() || buckets.front().count != 1)
                buckets.push_front({1, {}});
            buckets.front().keys.insert(key);
            keyMap[key] = buckets.begin();
        }
    }
    
    void dec(string key) {
        if (!keyMap.count(key)) return;
        auto it = keyMap[key];
        if (it->count == 1) {
            keyMap.erase(key);
        } else {
            int nc = it->count - 1;
            auto prv = (it == buckets.begin()) ? buckets.end() : prev(it);
            if (it == buckets.begin() || prv->count != nc)
                prv = buckets.insert(it, {nc, {}});
            prv->keys.insert(key);
            keyMap[key] = prv;
        }
        it->keys.erase(key);
        if (it->keys.empty()) buckets.erase(it);
    }
    
    string getMaxKey() {
        return buckets.empty() ? "" : *buckets.back().keys.begin();
    }
    string getMinKey() {
        return buckets.empty() ? "" : *buckets.front().keys.begin();
    }
};`,
    timeComplexity: "O(1) for all operations",
    spaceComplexity: "O(n)",
    patternGuide: "Use **doubly linked list of buckets + hashmap** when:\n- O(1) inc/dec AND O(1) max/min required\n- Elements grouped by frequency/count\n- Need to move elements between adjacent groups\n\nSimilar: LFU Cache, Max Frequency Stack"
},
{
    id: 136,
    lcNumber: 588,
    title: "Design In-Memory File System",
    difficulty: "Hard",
    category: "Trie",
    description: "Design an in-memory file system. Implement `ls(path)` (list directory or file), `mkdir(path)` (create directory path), `addContentToFile(filePath, content)` (append content to file), and `readContentFromFile(filePath)` (return file content).",
    examples: [
        "ls(\"/\") → []\nmkdir(\"/a/b/c\")\naddContentToFile(\"/a/b/c/d\", \"hello\")\nls(\"/\") → [\"a\"]\nls(\"/a/b\") → [\"c\"]\nls(\"/a/b/c/d\") → [\"d\"]\nreadContentFromFile(\"/a/b/c/d\") → \"hello\""
    ],
    thinkingProcess: [
        { step: "Model as a Trie / tree", detail: "A file system is naturally a tree. Each node is either a directory (has children) or a file (has content). The path `/a/b/c` traverses from root → a → b → c." },
        { step: "Node structure", detail: "Each node has: `children` (map of name → node), `content` (string, empty for directories), and `isFile` flag. Alternatively, presence of content implies file." },
        { step: "ls operation", detail: "Navigate to the path. If it's a file, return just the filename. If it's a directory, return sorted list of children names." },
        { step: "mkdir operation", detail: "Split path into components. Navigate from root, creating missing directories along the way. Like mkdir -p." },
        { step: "addContentToFile", detail: "Navigate to the file's parent directory (creating dirs if needed). Create the file node if it doesn't exist. Append content to the file's content string." },
        { step: "Path parsing", detail: "Split path by '/'. Handle root ('/') as empty path. Filter out empty strings from split result." }
    ],
    keyInsight: "Model the file system as a Trie (tree). Each node has a children map and optional file content. Navigate paths by splitting on '/'. ls returns sorted children for directories or just the name for files. All operations traverse the tree in O(path_length).",
    approach: "1. Tree node: children map, content string, isFile flag.\n2. Navigate path by splitting on '/'.\n3. ls: sort children or return filename.\n4. mkdir: create nodes along path.\n5. addContent: navigate to file, append content.",
    solutionPython: `class FSNode:
    def __init__(self):
        self.children = {}
        self.content = ""
        self.is_file = False

class FileSystem:
    def __init__(self):
        self.root = FSNode()
    
    def _navigate(self, path):
        node = self.root
        if path == "/":
            return node
        for part in path.split("/")[1:]:
            if part not in node.children:
                node.children[part] = FSNode()
            node = node.children[part]
        return node
    
    def ls(self, path):
        node = self._navigate(path)
        if node.is_file:
            return [path.split("/")[-1]]
        return sorted(node.children.keys())
    
    def mkdir(self, path):
        self._navigate(path)
    
    def addContentToFile(self, filePath, content):
        node = self._navigate(filePath)
        node.is_file = True
        node.content += content
    
    def readContentFromFile(self, filePath):
        return self._navigate(filePath).content`,
    solutionCpp: `#include <string>
#include <vector>
#include <map>
#include <sstream>
using namespace std;

struct FSNode {
    map<string, FSNode*> children;
    string content;
    bool isFile = false;
};

class FileSystem {
    FSNode* root;
    
    vector<string> split(const string& path) {
        vector<string> parts;
        stringstream ss(path);
        string item;
        while (getline(ss, item, '/'))
            if (!item.empty()) parts.push_back(item);
        return parts;
    }
    
    FSNode* navigate(const string& path) {
        FSNode* node = root;
        for (auto& p : split(path)) {
            if (!node->children[p])
                node->children[p] = new FSNode();
            node = node->children[p];
        }
        return node;
    }
    
public:
    FileSystem() { root = new FSNode(); }
    
    vector<string> ls(string path) {
        FSNode* node = navigate(path);
        if (node->isFile) return {split(path).back()};
        vector<string> result;
        for (auto& [name, _] : node->children)
            result.push_back(name);
        return result;
    }
    
    void mkdir(string path) { navigate(path); }
    
    void addContentToFile(string path, string content) {
        FSNode* node = navigate(path);
        node->isFile = true;
        node->content += content;
    }
    
    string readContentFromFile(string path) {
        return navigate(path)->content;
    }
};`,
    timeComplexity: "O(path_length + n_log_n for ls)",
    spaceComplexity: "O(total path components)",
    patternGuide: "Use **Trie as file system** when:\n- Hierarchical namespace with path-based operations\n- Need mkdir, ls, read, write primitives\n- Tree structure mirrors directory hierarchy\n\nSimilar: Implement Trie, Design Search Autocomplete, Unix-style path simplification"
},
{
    id: 137,
    lcNumber: 363,
    title: "Max Sum of Rectangle No Larger Than K",
    difficulty: "Hard",
    category: "Dynamic Programming",
    description: "Given an `m x n` matrix and an integer `k`, return the max sum of a rectangle in the matrix such that its sum is no larger than `k`. It is guaranteed that there exists a rectangle with sum ≤ k.",
    examples: [
        "Input: matrix = [[1,0,1],[0,-2,3]], k = 2\nOutput: 2\nExplanation: Rectangle [[0,1],[-2,3]] has sum 2.",
        "Input: matrix = [[2,2,-1]], k = 3\nOutput: 3"
    ],
    thinkingProcess: [
        { step: "Brute force: try all rectangles", detail: "O(m² × n²) rectangles, each needs O(mn) to sum = O(m³n³). Too slow. With prefix sums, computing any rectangle sum is O(1), but still O(m²n²) rectangles." },
        { step: "Fix two columns, reduce to 1D", detail: "Fix left column `c1` and right column `c2`. Compute the row sums between these columns. Now we have a 1D array. Problem reduces to: find max subarray sum ≤ k in a 1D array." },
        { step: "1D subproblem: max subarray sum ≤ k", detail: "Use prefix sums. For each right end `j`: `sum(i..j) = prefix[j] - prefix[i-1]`. We want max `(prefix[j] - prefix[i])` such that `prefix[j] - prefix[i] ≤ k`, i.e., `prefix[i] ≥ prefix[j] - k`." },
        { step: "Use a sorted set for prefix sums", detail: "Maintain a sorted set of prefix sums seen so far. For each `prefix[j]`, find the smallest `prefix[i]` in the set that is ≥ `prefix[j] - k` (using `lower_bound`). The difference gives the max sum ≤ k." },
        { step: "Combine: iterate column pairs + 1D query", detail: "For each pair (c1, c2): compute row sums, then apply the sorted-set approach. Total: O(m² × n × log n) or O(n² × m × log m) — choose based on dimensions." },
        { step: "Optimize: use the shorter dimension for the outer loop", detail: "If m < n, iterate over row pairs and compress columns. If n < m, iterate over column pairs. This minimizes the total work." }
    ],
    keyInsight: "Fix two columns, compress rows into a 1D array. Then find max subarray sum ≤ k using prefix sums + a sorted set (to find the smallest prefix ≥ current - k via binary search). Total: O(min(m,n)² × max(m,n) × log(max)).",
    approach: "1. For each column pair (c1, c2): compute row sums.\n2. Build prefix sums of the 1D row-sum array.\n3. For each prefix, use sorted set to find best prior prefix.\n4. Track global max sum ≤ k.",
    solutionPython: `from sortedcontainers import SortedList

def maxSumSubmatrix(matrix, k):
    m, n = len(matrix), len(matrix[0])
    ans = float('-inf')
    
    for c1 in range(n):
        row_sum = [0] * m
        for c2 in range(c1, n):
            for r in range(m):
                row_sum[r] += matrix[r][c2]
            
            # Find max subarray sum <= k in row_sum
            sl = SortedList([0])
            prefix = 0
            for val in row_sum:
                prefix += val
                # Find smallest prefix_i >= prefix - k
                idx = sl.bisect_left(prefix - k)
                if idx < len(sl):
                    ans = max(ans, prefix - sl[idx])
                sl.add(prefix)
    
    return ans`,
    solutionCpp: `#include <vector>
#include <set>
#include <algorithm>
#include <climits>
using namespace std;

int maxSumSubmatrix(vector<vector<int>>& matrix, int k) {
    int m = matrix.size(), n = matrix[0].size();
    int ans = INT_MIN;
    
    for (int c1 = 0; c1 < n; c1++) {
        vector<int> rowSum(m, 0);
        for (int c2 = c1; c2 < n; c2++) {
            for (int r = 0; r < m; r++)
                rowSum[r] += matrix[r][c2];
            
            set<int> prefixSet = {0};
            int prefix = 0;
            for (int val : rowSum) {
                prefix += val;
                auto it = prefixSet.lower_bound(prefix - k);
                if (it != prefixSet.end())
                    ans = max(ans, prefix - *it);
                prefixSet.insert(prefix);
            }
        }
    }
    return ans;
}`,
    timeComplexity: "O(n² × m × log m)",
    spaceComplexity: "O(m)",
    patternGuide: "Use **fix-2D-to-1D + sorted set** when:\n- Finding optimal rectangle/subarray sum with a constraint\n- Need max/min subarray sum ≤ k (or ≥ k)\n- Prefix sum + binary search finds the best pair\n\nSimilar: Max Subarray, Count Range Sum, Subarray Sum Equals K"
},
{
    id: 138,
    lcNumber: 778,
    title: "Swim in Rising Water",
    difficulty: "Hard",
    category: "Matrix",
    description: "You are given an `n x n` grid where `grid[i][j]` is the elevation at cell (i, j). At time `t`, the water level is `t`. You can swim from a cell to a 4-neighbor instantly if both cells have elevation ≤ t. Return the least time `t` at which you can reach (n-1, n-1) starting from (0, 0).",
    examples: [
        "Input: grid = [[0,2],[1,3]]\nOutput: 3\nExplanation: Wait until t=3 so the bottom-right (elevation 3) becomes reachable.",
        "Input: grid = [[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]\nOutput: 16\nExplanation: The minimum-max-elevation path crosses cell with elevation 16."
    ],
    thinkingProcess: [
        { step: "Reframe as 'minimize the maximum on the path'", detail: "Standard shortest-path minimizes the SUM of edge weights. Here we minimize the MAX elevation along any path from start to end — a classic 'minimax path' problem." },
        { step: "Approach 1: Dijkstra with a min-heap", detail: "Treat each cell's elevation as its 'cost'. Push (elevation, r, c) onto a min-heap, start from (grid[0][0], 0, 0). Pop the cell with the smallest 'time-to-reach', and relax neighbors using `max(current, neighbor.elevation)` instead of sum. First pop of (n-1, n-1) gives the answer." },
        { step: "Why max instead of sum?", detail: "Once you wait until time t for the worst cell on your path, every prior cell is already swimmable. So the path's cost = MAX elevation on it, not the sum." },
        { step: "Approach 2: Binary search on the answer", detail: "The answer t lies in [0, n²-1]. Binary search: for each candidate t, BFS/DFS using only cells with elevation ≤ t. If reachable, search lower; else search higher. O(n² · log n²) = O(n² log n)." },
        { step: "Approach 3: Union-Find by elevation", detail: "Sort cells by elevation. Add them one by one, unioning with already-added 4-neighbors. Answer = elevation at the moment (0,0) and (n-1,n-1) become connected. Same time complexity as Dijkstra." },
        { step: "Complexity", detail: "Dijkstra: O(n² log n). Binary search: O(n² log n). Union-Find: O(n² log n) (sorting dominates). All three are competitive — Dijkstra is the cleanest implementation." }
    ],
    keyInsight: "This is a 'minimax path' problem: minimize the MAXIMUM elevation along a path, not the sum. Dijkstra works if you replace `dist[v] = dist[u] + w(u,v)` with `dist[v] = max(dist[u], elev[v])`. The first time you pop the target, you have the answer.",
    approach: "1. Min-heap of (cost-so-far, r, c).\n2. Push (grid[0][0], 0, 0); track visited.\n3. Pop smallest; if target, return cost.\n4. For each 4-neighbor, push (max(cost, grid[nr][nc]), nr, nc).",
    solutionPython: `import heapq

def swimInWater(grid):
    n = len(grid)
    visited = [[False]*n for _ in range(n)]
    heap = [(grid[0][0], 0, 0)]
    DIRS = [(-1,0),(1,0),(0,-1),(0,1)]

    while heap:
        t, r, c = heapq.heappop(heap)
        if visited[r][c]:
            continue
        visited[r][c] = True
        if r == n-1 and c == n-1:
            return t
        for dr, dc in DIRS:
            nr, nc = r+dr, c+dc
            if 0 <= nr < n and 0 <= nc < n and not visited[nr][nc]:
                heapq.heappush(heap, (max(t, grid[nr][nc]), nr, nc))`,
    solutionCpp: `#include <vector>
#include <queue>
using namespace std;

int swimInWater(vector<vector<int>>& grid) {
    int n = grid.size();
    vector<vector<bool>> seen(n, vector<bool>(n, false));
    priority_queue<tuple<int,int,int>, vector<tuple<int,int,int>>, greater<>> pq;
    pq.push({grid[0][0], 0, 0});
    int dirs[4][2] = {{-1,0},{1,0},{0,-1},{0,1}};

    while (!pq.empty()) {
        auto [t, r, c] = pq.top(); pq.pop();
        if (seen[r][c]) continue;
        seen[r][c] = true;
        if (r == n-1 && c == n-1) return t;
        for (auto& d : dirs) {
            int nr = r+d[0], nc = c+d[1];
            if (nr>=0 && nr<n && nc>=0 && nc<n && !seen[nr][nc])
                pq.push({max(t, grid[nr][nc]), nr, nc});
        }
    }
    return -1;
}`,
    timeComplexity: "O(n² log n)",
    spaceComplexity: "O(n²)",
    patternGuide: "Use **Dijkstra with max-relaxation (minimax path)** when:\n- Grid/graph with cost = bottleneck (max), not sum\n- 'Minimum effort' / 'minimum threshold' path problems\n- Alternative: binary search on answer + BFS, or Union-Find by sorted weight\n\nSimilar: Path with Minimum Effort, Network Delay Time, Minimum Cost Path"
},
{
    id: 139,
    lcNumber: 691,
    title: "Stickers to Spell Word",
    difficulty: "Hard",
    category: "Dynamic Programming",
    description: "You have `n` different types of stickers (each represented as a string). Each sticker has a lowercase English letter on each unit. You want to spell out the given string `target` by cutting individual letters from stickers and rearranging them. Each sticker can be used any number of times. Return the minimum number of stickers to spell the target, or -1 if impossible.",
    examples: [
        "Input: stickers = [\"with\",\"example\",\"science\"], target = \"thehat\"\nOutput: 3\nExplanation: Use 2× \"with\" and 1× \"example\". t,h from first \"with\", h,a from \"example\", t from second \"with\".",
        "Input: stickers = [\"notice\",\"possible\"], target = \"basicbasic\"\nOutput: -1"
    ],
    thinkingProcess: [
        { step: "State: which target letters still needed", detail: "Since target length ≤ 15, we can use a bitmask to represent which letters of the target are still needed. State = bitmask of unsatisfied positions." },
        { step: "Transition: apply a sticker", detail: "For each state (bitmask), try applying each sticker. A sticker satisfies some subset of remaining letters. After applying, we get a new bitmask with those letters removed." },
        { step: "BFS or DP on bitmask", detail: "DP: `dp[mask]` = minimum stickers to satisfy the positions indicated by `mask`. Start from full mask (all needed), target is mask = 0 (all satisfied). Or BFS from mask=0, building up satisfied letters." },
        { step: "Applying a sticker to a mask", detail: "Given a mask and a sticker: greedily match sticker letters to unsatisfied target positions. For each sticker letter, if it matches an unsatisfied position, mark that position satisfied. This gives the new mask." },
        { step: "Optimization: for each state, only try stickers that contain the first unsatisfied letter", detail: "Since we must eventually satisfy every letter, we can fix: for each state, find the first unsatisfied position, and only try stickers that have that letter. This dramatically reduces branching." },
        { step: "Complexity", detail: "2^target_len states × n stickers × target_len per transition. With target ≤ 15 and optimization, this is manageable." }
    ],
    keyInsight: "Bitmask DP where each bit represents a target character still needed. For each state, try each sticker and compute the resulting state. Key optimization: only try stickers that cover the first unsatisfied character, since it must be covered eventually.",
    approach: "1. Represent target state as bitmask.\n2. `dp[mask]` = min stickers to cover bits in mask.\n3. For each mask, find first uncovered bit.\n4. Try only stickers containing that character.\n5. Greedily match sticker letters to uncovered bits.\n6. dp[0] = 0 (base), answer = dp[full_mask].",
    solutionPython: `def minStickers(stickers, target):
    n = len(target)
    FULL = (1 << n) - 1
    
    # Preprocess sticker letter counts
    from collections import Counter
    sticker_counts = [Counter(s) for s in stickers]
    
    dp = {0: 0}  # mask -> min stickers
    
    for mask in range(FULL + 1):
        if mask not in dp:
            continue
        
        # Find first uncovered position
        first_uncovered = -1
        for i in range(n):
            if not (mask & (1 << i)):
                first_uncovered = i
                break
        if first_uncovered == -1:
            continue
        
        for sc in sticker_counts:
            # Only try stickers with the needed letter
            if target[first_uncovered] not in sc:
                continue
            
            # Apply sticker
            remaining = dict(sc)
            new_mask = mask
            for i in range(n):
                if not (new_mask & (1 << i)) and target[i] in remaining and remaining[target[i]] > 0:
                    new_mask |= (1 << i)
                    remaining[target[i]] -= 1
            
            if new_mask not in dp or dp[new_mask] > dp[mask] + 1:
                dp[new_mask] = dp[mask] + 1
    
    return dp.get(FULL, -1)`,
    solutionCpp: `#include <vector>
#include <string>
#include <climits>
using namespace std;

int minStickers(vector<string>& stickers, string target) {
    int n = target.size(), FULL = (1 << n) - 1;
    vector<int> dp(FULL + 1, INT_MAX);
    dp[0] = 0;
    
    // Preprocess stickers as letter counts
    vector<vector<int>> sc(stickers.size(), vector<int>(26, 0));
    for (int i = 0; i < (int)stickers.size(); i++)
        for (char c : stickers[i]) sc[i][c-'a']++;
    
    for (int mask = 0; mask < FULL; mask++) {
        if (dp[mask] == INT_MAX) continue;
        
        // Find first uncovered bit
        int first = -1;
        for (int i = 0; i < n; i++)
            if (!(mask & (1<<i))) { first = i; break; }
        
        for (int s = 0; s < (int)sc.size(); s++) {
            if (sc[s][target[first]-'a'] == 0) continue;
            
            auto rem = sc[s];
            int nm = mask;
            for (int i = 0; i < n; i++) {
                if (!(nm & (1<<i)) && rem[target[i]-'a'] > 0) {
                    nm |= (1<<i);
                    rem[target[i]-'a']--;
                }
            }
            dp[nm] = min(dp[nm], dp[mask] + 1);
        }
    }
    return dp[FULL] == INT_MAX ? -1 : dp[FULL];
}`,
    timeComplexity: "O(2^n × m × n) where n=target length, m=stickers",
    spaceComplexity: "O(2^n)",
    patternGuide: "Use **bitmask DP** when:\n- Target string/set is small (≤ 15-20)\n- Track which elements are satisfied/used\n- Each action covers a subset of remaining elements\n\nSimilar: Shortest Superstring, Minimum XOR Sum, Can I Win"
},
{
    id: 140,
    lcNumber: 952,
    title: "Largest Component Size by Common Factor",
    difficulty: "Hard",
    category: "Union Find",
    description: "You are given an integer array `nums`. Two elements are connected if they share a common factor > 1. Return the size of the largest connected component.",
    examples: [
        "Input: nums = [4,6,15,35]\nOutput: 4\nExplanation: 4-6 share 2, 6-15 share 3, 15-35 share 5. All connected.",
        "Input: nums = [20,50,9,63]\nOutput: 2\nExplanation: 20-50 share 2 and 5. 9-63 share 3 and 9. Two components of size 2."
    ],
    thinkingProcess: [
        { step: "Pairwise GCD is too slow", detail: "Checking GCD for all pairs is O(n² × log(max_val)). With n up to 20000 and values up to 100000, this is too slow." },
        { step: "Factor each number", detail: "Instead of comparing pairs, factor each number into its prime factors. Two numbers sharing a prime factor should be in the same component." },
        { step: "Union by shared prime factors", detail: "For each number, find all its prime factors. Union the number with each of its prime factors (using the factor as a virtual node). All numbers sharing a prime will be connected through that prime's virtual node." },
        { step: "Union Find with virtual nodes", detail: "Use Union Find with both number indices and prime factor values as nodes. For each `nums[i]`, union `i` with each prime factor of `nums[i]`. Then count component sizes." },
        { step: "Efficient factorization", detail: "Factorize each number in O(√n). For n up to 100000, √n ≈ 316. Total factorization: O(n × √max_val)." },
        { step: "Count largest component", detail: "After all unions, count how many array elements share the same root. The maximum count is the answer." }
    ],
    keyInsight: "Factor each number into primes. Use Union Find to union each number with its prime factors. Numbers sharing any prime factor end up in the same component. This avoids O(n²) pairwise comparison by connecting through shared prime 'virtual nodes'.",
    approach: "1. Union Find with space for both indices and prime values.\n2. For each number, find prime factors.\n3. Union the number's index with each prime factor.\n4. Count component sizes among array indices.\n5. Return maximum size.",
    solutionPython: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n
    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x
    def union(self, a, b):
        a, b = self.find(a), self.find(b)
        if a == b: return
        if self.size[a] < self.size[b]: a, b = b, a
        self.parent[b] = a
        self.size[a] += self.size[b]

def largestComponentSize(nums):
    max_val = max(nums) + 1
    uf = UnionFind(max_val)
    
    for num in nums:
        # Find prime factors and union with num
        d = 2
        temp = num
        while d * d <= temp:
            if temp % d == 0:
                uf.union(num, d)
                while temp % d == 0:
                    temp //= d
            d += 1
        if temp > 1:
            uf.union(num, temp)
    
    # Count component sizes
    from collections import Counter
    roots = [uf.find(num) for num in nums]
    return max(Counter(roots).values())`,
    solutionCpp: `#include <vector>
#include <unordered_map>
#include <algorithm>
using namespace std;

class UnionFind {
public:
    vector<int> parent, sz;
    UnionFind(int n) : parent(n), sz(n, 1) {
        iota(parent.begin(), parent.end(), 0);
    }
    int find(int x) {
        while (parent[x] != x) x = parent[x] = parent[parent[x]];
        return x;
    }
    void unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return;
        if (sz[a] < sz[b]) swap(a, b);
        parent[b] = a; sz[a] += sz[b];
    }
};

int largestComponentSize(vector<int>& nums) {
    int maxVal = *max_element(nums.begin(), nums.end()) + 1;
    UnionFind uf(maxVal);
    
    for (int num : nums) {
        int temp = num;
        for (int d = 2; d * d <= temp; d++) {
            if (temp % d == 0) {
                uf.unite(num, d);
                while (temp % d == 0) temp /= d;
            }
        }
        if (temp > 1) uf.unite(num, temp);
    }
    
    unordered_map<int, int> cnt;
    int ans = 0;
    for (int num : nums)
        ans = max(ans, ++cnt[uf.find(num)]);
    return ans;
}`,
    timeComplexity: "O(n × √max_val × α(max_val))",
    spaceComplexity: "O(max_val)",
    patternGuide: "Use **Union Find with prime factor virtual nodes** when:\n- Grouping numbers by shared factors\n- Pairwise comparison too slow\n- Each number connects to its factors as intermediaries\n\nSimilar: Accounts Merge, Redundant Connection, Number of Connected Components"
},
{
    id: 141,
    lcNumber: 1335,
    title: "Minimum Difficulty of a Job Schedule",
    difficulty: "Hard",
    category: "Dynamic Programming",
    description: "Given an array `jobDifficulty` and integer `d`, schedule the jobs over `d` days. Each day must have at least one job; jobs must be done in order. The difficulty of a day = max difficulty of its jobs. Return the minimum total difficulty (sum over days), or -1 if impossible.",
    examples: [
        "Input: jobDifficulty = [6,5,4,3,2,1], d = 2\nOutput: 7\nExplanation: Day 1 = [6,5,4,3,2] (max 6), Day 2 = [1] (max 1) → 6+1 = 7.",
        "Input: jobDifficulty = [9,9,9], d = 4\nOutput: -1   (only 3 jobs, can't fill 4 days)",
        "Input: jobDifficulty = [7,1,7,1,7,1], d = 3\nOutput: 15"
    ],
    thinkingProcess: [
        { step: "Recognize the partitioning structure", detail: "We must split a sequence into `d` contiguous, non-empty groups. Cost per group = max element. Total cost = sum of group maxes. Minimize that sum. Classic 'partition array into K parts' DP." },
        { step: "Feasibility check", detail: "If `n < d`, return -1 — we can't give every day at least one job." },
        { step: "State definition", detail: "`dp[i][k]` = minimum total difficulty to schedule the first `i` jobs using exactly `k` days. We want `dp[n][d]`." },
        { step: "Transition", detail: "To compute `dp[i][k]`, decide how many jobs go on day `k` — say jobs `j..i-1`. Then `dp[i][k] = min over j of dp[j][k-1] + max(jobs[j..i-1])`. j ranges so that prior days each have ≥1 job: `k-1 ≤ j ≤ i-1`." },
        { step: "Compute the running max efficiently", detail: "For fixed `i, k`, iterate `j` from `i-1` down to `k-1` while maintaining a running `curMax = max(curMax, jobs[j])`. This makes the inner loop O(n) and total O(n² · d)." },
        { step: "Optimization with monotonic stack", detail: "There's an O(n · d) solution using a monotonic decreasing stack to compute the contribution of each job's max range — but the O(n² d) DP is the standard interview answer and easily fits within constraints (n ≤ 300, d ≤ 10)." }
    ],
    keyInsight: "Classic 'split sequence into K contiguous groups' DP: `dp[i][k] = min over split-point j of dp[j][k-1] + max(arr[j..i-1])`. Compute the inner max while iterating j right-to-left in O(1) — no separate range-max query needed.",
    approach: "1. If n < d return -1.\n2. dp[i][k] = min schedule cost for first i jobs in k days.\n3. Transition: scan j from i-1 down to k-1, track curMax.\n4. dp[i][k] = min(dp[j][k-1] + curMax).\n5. Answer: dp[n][d].",
    solutionPython: `def minDifficulty(jobDifficulty, d):
    n = len(jobDifficulty)
    if n < d:
        return -1

    INF = float('inf')
    # dp[i][k] = min cost to schedule jobs[0:i] in k days
    dp = [[INF] * (d + 1) for _ in range(n + 1)]
    dp[0][0] = 0

    for i in range(1, n + 1):
        for k in range(1, d + 1):
            cur_max = 0
            # last day takes jobs[j:i]; need k-1 jobs before → j >= k-1
            for j in range(i - 1, k - 2, -1):
                cur_max = max(cur_max, jobDifficulty[j])
                if dp[j][k - 1] + cur_max < dp[i][k]:
                    dp[i][k] = dp[j][k - 1] + cur_max

    return dp[n][d]`,
    solutionCpp: `#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

int minDifficulty(vector<int>& jobDifficulty, int d) {
    int n = jobDifficulty.size();
    if (n < d) return -1;

    const int INF = INT_MAX / 2;
    vector<vector<int>> dp(n + 1, vector<int>(d + 1, INF));
    dp[0][0] = 0;

    for (int i = 1; i <= n; i++) {
        for (int k = 1; k <= d; k++) {
            int curMax = 0;
            for (int j = i - 1; j >= k - 1; j--) {
                curMax = max(curMax, jobDifficulty[j]);
                dp[i][k] = min(dp[i][k], dp[j][k - 1] + curMax);
            }
        }
    }
    return dp[n][d];
}`,
    timeComplexity: "O(n² · d)",
    spaceComplexity: "O(n · d)",
    patternGuide: "Use **partition-into-K-groups DP** when:\n- Split a sequence into K contiguous, non-empty parts\n- Cost per part is some aggregate (max/min/sum)\n- Minimize/maximize total of part costs\n- Track running aggregate while iterating split point to avoid extra log factor\n\nSimilar: Split Array Largest Sum, Palindrome Partitioning II, Allocate Mailboxes"
},
{
    id: 142,
    lcNumber: 1425,
    title: "Constrained Subsequence Sum",
    difficulty: "Hard",
    category: "Dynamic Programming",
    description: "Given an integer array `nums` and an integer `k`, return the maximum sum of a non-empty subsequence of `nums` such that for every two consecutive elements `nums[i]` and `nums[j]` in the subsequence, `j - i ≤ k`.",
    examples: [
        "Input: nums = [10,2,-10,5,20], k = 2\nOutput: 37\nExplanation: Subsequence [10, 2, 5, 20] with gaps ≤ 2.",
        "Input: nums = [-1,-2,-3], k = 1\nOutput: -1",
        "Input: nums = [10,-2,-10,-5,20], k = 2\nOutput: 23"
    ],
    thinkingProcess: [
        { step: "DP formulation", detail: "`dp[i]` = maximum sum subsequence ending at index `i`. For each `i`, the previous element in the subsequence can be at any `j` in `[i-k, i-1]`. So `dp[i] = nums[i] + max(0, max(dp[j] for j in [i-k, i-1]))`." },
        { step: "Naive is O(nk)", detail: "For each i, scan the k previous dp values. With n,k up to 10^5, this is 10^10 — too slow." },
        { step: "Sliding window maximum with monotone deque", detail: "We need max(dp[j]) over a sliding window of size k. This is exactly the 'sliding window maximum' problem — solved with a monotone decreasing deque in O(n)." },
        { step: "Deque stores dp values", detail: "Maintain a deque of indices sorted by decreasing dp value. For each i: (1) remove front if out of window (index < i-k). (2) dp[i] = nums[i] + max(0, dp[deque.front]). (3) remove back while dp[back] ≤ dp[i], push i." },
        { step: "Handle the 'max with 0'", detail: "Adding `max(0, ...)` means we can start a new subsequence at i if all previous dp values are negative. This ensures we don't extend a losing subsequence." },
        { step: "Final answer", detail: "Return max(dp) — the maximum over all ending positions." }
    ],
    keyInsight: "DP with `dp[i] = nums[i] + max(0, max of dp[i-k..i-1])`. The sliding window max is computed via a monotone decreasing deque, turning the O(nk) DP into O(n). This is the 'DP + sliding window maximum' pattern.",
    approach: "1. `dp[i]` = best sum ending at i.\n2. Monotone deque tracks max dp in window [i-k, i-1].\n3. For each i: pop expired front, compute dp[i], pop dominated back, push.\n4. Return max(dp).",
    solutionPython: `from collections import deque

def constrainedSubsetSum(nums, k):
    n = len(nums)
    dp = nums[:]
    dq = deque()  # indices, dp values decreasing
    
    for i in range(n):
        # Remove expired
        while dq and dq[0] < i - k:
            dq.popleft()
        
        # Extend from best in window
        if dq:
            dp[i] = max(dp[i], nums[i] + dp[dq[0]])
        
        # Maintain decreasing order
        while dq and dp[dq[-1]] <= dp[i]:
            dq.pop()
        dq.append(i)
    
    return max(dp)`,
    solutionCpp: `#include <vector>
#include <deque>
#include <algorithm>
using namespace std;

int constrainedSubsetSum(vector<int>& nums, int k) {
    int n = nums.size();
    vector<int> dp = nums;
    deque<int> dq;
    
    for (int i = 0; i < n; i++) {
        while (!dq.empty() && dq.front() < i - k)
            dq.pop_front();
        
        if (!dq.empty())
            dp[i] = max(dp[i], nums[i] + dp[dq.front()]);
        
        while (!dq.empty() && dp[dq.back()] <= dp[i])
            dq.pop_back();
        dq.push_back(i);
    }
    return *max_element(dp.begin(), dp.end());
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    patternGuide: "Use **DP + monotone deque (sliding window max)** when:\n- DP transition looks back at a window of previous states\n- Need max/min over a sliding range of DP values\n- Converts O(nk) DP to O(n)\n\nSimilar: Sliding Window Maximum, Jump Game VI, Shortest Subarray with Sum ≥ K"
},
{
    id: 143,
    lcNumber: 1153,
    title: "String Transforms Into Another String",
    difficulty: "Hard",
    category: "String",
    description: "Given two strings `str1` and `str2` of the same length, determine if `str1` can be transformed into `str2` by performing zero or more conversions. In one conversion, all occurrences of one character in `str1` are changed to another character. Return true if the transformation is possible.",
    examples: [
        "Input: str1 = \"aabcc\", str2 = \"ccdee\"\nOutput: true\nExplanation: a→c, b→d, c→e (convert all a's first, then b's, then c's)",
        "Input: str1 = \"leetcode\", str2 = \"codeleet\"\nOutput: false"
    ],
    thinkingProcess: [
        { step: "Understand the conversion rule", detail: "Each conversion changes ALL occurrences of one character to another. So if 'a' maps to 'c', every 'a' in str1 becomes 'c'. A character in str1 can only map to ONE character in str2." },
        { step: "Build the mapping", detail: "For each index, str1[i] must map to str2[i]. If str1[i] already maps to a different character than str2[i], transformation is impossible (one-to-many mapping)." },
        { step: "One-to-one mapping isn't enough", detail: "Even with a valid mapping, we might have circular dependencies: a→b, b→c, c→a. We need to convert one at a time. If a→b, converting a first gives us b's everywhere. Then converting b→c converts both original b's AND the new ones from a." },
        { step: "Circular dependencies need a temp character", detail: "For a→b, b→a: convert a→temp, convert b→a, convert temp→b. But this requires a character not yet used in str2! If str2 uses all 26 characters, there's no temp available." },
        { step: "Key insight: check if str2 uses all 26 chars", detail: "If the number of unique characters in str2 < 26, we always have a 'temp' character available to break cycles. If str2 uses all 26, and a cycle exists, we can't break it → impossible." },
        { step: "Special case: str1 == str2", detail: "Obviously return true. Also handle: if str2 has < 26 unique chars, return true (as long as the mapping is consistent). If str2 has all 26 unique chars, return true only if str1 == str2." }
    ],
    keyInsight: "Build a character mapping from str1 to str2. Check consistency (no one-to-many). Then: if str2 uses < 26 unique characters, transformation is always possible (we have a temp char to break cycles). If str2 uses all 26 AND str1 ≠ str2, it's impossible (no temp for cycles).",
    approach: "1. Build mapping: str1[i] → str2[i].\n2. Check consistency: same char in str1 can't map to different chars in str2.\n3. If str2 has < 26 unique chars → return true.\n4. If str2 has 26 unique chars → return str1 == str2.",
    solutionPython: `def canConvert(str1, str2):
    if str1 == str2:
        return True
    
    # Build mapping
    mapping = {}
    for c1, c2 in zip(str1, str2):
        if c1 in mapping:
            if mapping[c1] != c2:
                return False  # one-to-many
        else:
            mapping[c1] = c2
    
    # If str2 uses all 26 chars, no temp available for cycles
    return len(set(str2)) < 26`,
    solutionCpp: `#include <string>
#include <unordered_map>
#include <unordered_set>
using namespace std;

bool canConvert(string str1, string str2) {
    if (str1 == str2) return true;
    
    unordered_map<char, char> mapping;
    for (int i = 0; i < (int)str1.size(); i++) {
        if (mapping.count(str1[i])) {
            if (mapping[str1[i]] != str2[i]) return false;
        } else {
            mapping[str1[i]] = str2[i];
        }
    }
    
    unordered_set<char> targets(str2.begin(), str2.end());
    return targets.size() < 26;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1) — at most 26 mappings",
    patternGuide: "Use **mapping consistency + cycle analysis** when:\n- Character/symbol transformation problems\n- All occurrences must transform uniformly\n- Check if a 'temp' exists to break circular dependencies\n\nSimilar: Isomorphic Strings, Word Pattern"
},
{
    id: 144,
    lcNumber: 854,
    title: "K-Similar Strings",
    difficulty: "Hard",
    category: "Graph BFS/DFS",
    description: "Strings `s1` and `s2` are k-similar if we can swap the positions of two letters in `s1` exactly `k` times to get `s2`. Given two anagrams `s1` and `s2`, return the smallest `k` for which `s1` and `s2` are k-similar.",
    examples: [
        "Input: s1 = \"ab\", s2 = \"ba\"\nOutput: 1",
        "Input: s1 = \"abc\", s2 = \"bca\"\nOutput: 2\nExplanation: \"abc\" → \"bac\" → \"bca\""
    ],
    thinkingProcess: [
        { step: "Model as shortest path / BFS", detail: "Each string state is a node. A swap creates an edge. We want minimum swaps from s1 to s2 — minimum edges → BFS." },
        { step: "Reduce the search space", detail: "Only swap positions where s1[i] ≠ s2[i]. For the first mismatch position `i`, try swapping s1[i] with s1[j] where j > i and s1[j] == s2[i]. This moves s1[i] to its correct position." },
        { step: "Why fix the first mismatch?", detail: "We must fix every mismatch eventually. By always fixing the leftmost mismatch first, we avoid redundant states and reduce branching." },
        { step: "Prefer swaps that fix two positions", detail: "If we find j where s1[j] == s2[i] AND s1[i] == s2[j], this single swap fixes TWO mismatches. Always try these first — they're strictly better." },
        { step: "BFS with string states", detail: "Queue strings, visited set of strings. For each state, find first mismatch, try all valid swaps, enqueue new states. First time we reach s2 = answer." },
        { step: "Pruning", detail: "For strings ≤ 20 chars with only 6 distinct letters, the state space is manageable. The greedy heuristic of fixing the first mismatch with preference for two-fix swaps makes this fast in practice." }
    ],
    keyInsight: "BFS on string states. At each state, find the first position where s1 ≠ s2 and try all swaps that fix it. Prefer swaps that fix two mismatches at once. BFS guarantees minimum swaps. Fixing leftmost mismatch first reduces the search space dramatically.",
    approach: "1. BFS from s1 to s2.\n2. At each state, find first index where s1[i] ≠ s2[i].\n3. Try swapping s1[i] with s1[j] where s1[j] == s2[i] and j > i.\n4. Prefer j where s1[i] == s2[j] (fixes two positions).\n5. First time we reach s2 = minimum k.",
    solutionPython: `from collections import deque

def kSimilarity(s1, s2):
    if s1 == s2:
        return 0
    
    queue = deque([(s1, 0)])
    visited = {s1}
    
    while queue:
        curr, swaps = queue.popleft()
        
        # Find first mismatch
        i = 0
        while curr[i] == s2[i]:
            i += 1
        
        for j in range(i + 1, len(curr)):
            if curr[j] == s2[i] and curr[j] != s2[j]:
                # Swap positions i and j
                new_s = list(curr)
                new_s[i], new_s[j] = new_s[j], new_s[i]
                new_s = ''.join(new_s)
                
                if new_s == s2:
                    return swaps + 1
                if new_s not in visited:
                    visited.add(new_s)
                    queue.append((new_s, swaps + 1))
    
    return -1`,
    solutionCpp: `#include <string>
#include <queue>
#include <unordered_set>
using namespace std;

int kSimilarity(string s1, string s2) {
    if (s1 == s2) return 0;
    
    queue<pair<string,int>> q;
    unordered_set<string> visited = {s1};
    q.push({s1, 0});
    
    while (!q.empty()) {
        auto [curr, swaps] = q.front(); q.pop();
        
        int i = 0;
        while (curr[i] == s2[i]) i++;
        
        for (int j = i + 1; j < (int)curr.size(); j++) {
            if (curr[j] == s2[i] && curr[j] != s2[j]) {
                string next = curr;
                swap(next[i], next[j]);
                if (next == s2) return swaps + 1;
                if (!visited.count(next)) {
                    visited.insert(next);
                    q.push({next, swaps + 1});
                }
            }
        }
    }
    return -1;
}`,
    timeComplexity: "O(n! / (n-k)!) in theory, fast in practice",
    spaceComplexity: "O(states visited)",
    patternGuide: "Use **BFS on permutation states** when:\n- Minimum swaps/operations to transform one arrangement to another\n- Each operation modifies the state by a small amount\n- Fix the first mismatch to reduce branching\n\nSimilar: Minimum Swaps to Sort, Sliding Puzzle, Scramble String"
},
{
    id: 145,
    lcNumber: 1125,
    title: "Smallest Sufficient Team",
    difficulty: "Hard",
    category: "Dynamic Programming",
    description: "In a project, you have a list of required skills `req_skills` and a list of people where `people[i]` is the list of skills that person `i` has. Return the smallest sufficient team — a set of people whose combined skills cover all required skills.",
    examples: [
        "Input: req_skills = [\"java\",\"nodejs\",\"reactjs\"], people = [[\"java\"],[\"nodejs\"],[\"nodejs\",\"reactjs\"]]\nOutput: [0,2]\nExplanation: Person 0 has java, person 2 has nodejs + reactjs. Together they cover all skills."
    ],
    thinkingProcess: [
        { step: "Small number of skills → bitmask", detail: "req_skills has at most 16 skills. Represent each person's skill set as a bitmask. The target is the full bitmask (all bits set). Find the minimum set of people whose OR covers all bits." },
        { step: "This is Set Cover (NP-hard)", detail: "Minimum set cover is NP-hard in general, but with ≤ 16 skills, the bitmask has 2^16 = 65536 states. This is tractable for DP." },
        { step: "DP on bitmask", detail: "`dp[mask]` = minimum people needed to cover skills in `mask`. Actually, we need the actual team, so store `dp[mask]` = the team (list of people) that achieves this mask with minimum size." },
        { step: "Transition", detail: "For each person `p` with skill mask `p_mask`: for each existing state `mask`, the new state is `mask | p_mask`. If `dp[mask | p_mask]` hasn't been reached or has a larger team, update it." },
        { step: "Optimization: skip dominated people", detail: "If person A's skills are a subset of person B's skills, person A is dominated — skip them. Also, process people with more skills first for earlier convergence." },
        { step: "Space optimization", detail: "Instead of storing full teams, store `dp[mask] = (size, last_person, prev_mask)`. Reconstruct the team by backtracking." }
    ],
    keyInsight: "Bitmask DP with skills as bits. `dp[mask]` = smallest team achieving skill coverage `mask`. For each person, try adding them to every existing state. With ≤ 16 skills, only 2^16 states. Use backtracking pointers to reconstruct the actual team.",
    approach: "1. Map skills to bit positions.\n2. Convert each person's skills to a bitmask.\n3. DP: for each existing mask, try adding each person.\n4. `dp[mask | person_mask]` = dp[mask] + person.\n5. Minimize team size. Backtrack to recover team.",
    solutionPython: `def smallestSufficientTeam(req_skills, people):
    n = len(req_skills)
    skill_idx = {s: i for i, s in enumerate(req_skills)}
    
    # Convert people to bitmasks
    p_masks = []
    for skills in people:
        mask = 0
        for s in skills:
            if s in skill_idx:
                mask |= (1 << skill_idx[s])
        p_masks.append(mask)
    
    FULL = (1 << n) - 1
    # dp[mask] = smallest team (as list) to cover mask
    dp = {0: []}
    
    for i, pm in enumerate(p_masks):
        if pm == 0:
            continue
        # Iterate over current states (snapshot to avoid mutation issues)
        for mask, team in list(dp.items()):
            new_mask = mask | pm
            if new_mask not in dp or len(dp[new_mask]) > len(team) + 1:
                dp[new_mask] = team + [i]
    
    return dp[FULL]`,
    solutionCpp: `#include <vector>
#include <string>
#include <unordered_map>
using namespace std;

vector<int> smallestSufficientTeam(vector<string>& req_skills, vector<vector<string>>& people) {
    int n = req_skills.size();
    unordered_map<string, int> sidx;
    for (int i = 0; i < n; i++) sidx[req_skills[i]] = i;
    
    int m = people.size(), FULL = (1 << n) - 1;
    vector<int> pmask(m, 0);
    for (int i = 0; i < m; i++)
        for (auto& s : people[i])
            if (sidx.count(s)) pmask[i] |= (1 << sidx[s]);
    
    // dp[mask] = {team size, last person, prev mask}
    vector<int> dpSize(FULL+1, m+1);
    vector<int> dpPerson(FULL+1, -1), dpPrev(FULL+1, -1);
    dpSize[0] = 0;
    
    for (int mask = 0; mask <= FULL; mask++) {
        if (dpSize[mask] > m) continue;
        for (int i = 0; i < m; i++) {
            int nm = mask | pmask[i];
            if (dpSize[mask] + 1 < dpSize[nm]) {
                dpSize[nm] = dpSize[mask] + 1;
                dpPerson[nm] = i;
                dpPrev[nm] = mask;
            }
        }
    }
    
    // Reconstruct
    vector<int> result;
    int mask = FULL;
    while (mask > 0) {
        result.push_back(dpPerson[mask]);
        mask = dpPrev[mask];
    }
    return result;
}`,
    timeComplexity: "O(2^n × m) where n=skills, m=people",
    spaceComplexity: "O(2^n)",
    patternGuide: "Use **bitmask DP for set cover** when:\n- Small number of elements to cover (≤ 20)\n- Each 'item' covers a subset of elements\n- Minimum items to cover all elements (NP-hard but tractable for small n)\n\nSimilar: Stickers to Spell Word, Minimum Number of Work Sessions"
},
{
    id: 146,
    lcNumber: 1192,
    title: "Critical Connections in a Network",
    difficulty: "Hard",
    category: "Graph BFS/DFS",
    description: "There are `n` servers numbered 0 to n-1 connected by undirected edges. A critical connection is an edge whose removal disconnects the graph. Return all critical connections.",
    examples: [
        "Input: n = 4, connections = [[0,1],[1,2],[2,0],[1,3]]\nOutput: [[1,3]]\nExplanation: Removing edge [1,3] disconnects server 3 from the rest."
    ],
    thinkingProcess: [
        { step: "This is the 'bridges' problem", detail: "A bridge is an edge whose removal disconnects the graph. Classic graph theory problem solved by Tarjan's bridge-finding algorithm." },
        { step: "DFS discovery and low-link values", detail: "Run DFS. For each node, track:\n- `disc[u]` = discovery time (when DFS first visits u)\n- `low[u]` = lowest discovery time reachable from u's subtree via back edges" },
        { step: "When is an edge a bridge?", detail: "Edge (u, v) where u is parent of v in DFS tree: it's a bridge if `low[v] > disc[u]`. This means there's no back edge from v's subtree to u or u's ancestors. Removing (u,v) disconnects v's subtree." },
        { step: "Computing low values", detail: "For each node u during DFS:\n- `low[u] = disc[u]` initially\n- For each neighbor v: if unvisited, recurse, then `low[u] = min(low[u], low[v])`. If v is visited and not parent, `low[u] = min(low[u], disc[v])` (back edge)." },
        { step: "Why low[v] > disc[u] (not ≥)?", detail: "If `low[v] == disc[u]`, there's a back edge from v's subtree to u itself. Removing (u,v) still leaves u reachable via the back edge path. So u-v is NOT a bridge. Only `low[v] > disc[u]` means true disconnection." },
        { step: "Single DFS pass", detail: "The entire algorithm runs in one DFS: O(V + E). No need for multiple passes or complex data structures." }
    ],
    keyInsight: "Tarjan's algorithm: DFS tracking discovery time and low-link values. Edge (u,v) is a bridge if `low[v] > disc[u]` — meaning no back edge from v's subtree reaches u or above. One DFS pass finds all bridges in O(V+E).",
    approach: "1. DFS from any node. Track disc[] and low[].\n2. For tree edge (u→v): after DFS(v), low[u] = min(low[u], low[v]).\n3. For back edge (u→v): low[u] = min(low[u], disc[v]).\n4. If low[v] > disc[u], edge (u,v) is a bridge.\n5. Collect all bridges.",
    solutionPython: `def criticalConnections(n, connections):
    graph = [[] for _ in range(n)]
    for u, v in connections:
        graph[u].append(v)
        graph[v].append(u)
    
    disc = [-1] * n
    low = [0] * n
    bridges = []
    timer = [0]
    
    def dfs(u, parent):
        disc[u] = low[u] = timer[0]
        timer[0] += 1
        
        for v in graph[u]:
            if v == parent:
                continue
            if disc[v] == -1:
                dfs(v, u)
                low[u] = min(low[u], low[v])
                if low[v] > disc[u]:
                    bridges.append([u, v])
            else:
                low[u] = min(low[u], disc[v])
    
    dfs(0, -1)
    return bridges`,
    solutionCpp: `#include <vector>
using namespace std;

class Solution {
    int timer = 0;
    vector<int> disc, low;
    vector<vector<int>> graph, bridges;
    
    void dfs(int u, int parent) {
        disc[u] = low[u] = timer++;
        for (int v : graph[u]) {
            if (v == parent) continue;
            if (disc[v] == -1) {
                dfs(v, u);
                low[u] = min(low[u], low[v]);
                if (low[v] > disc[u])
                    bridges.push_back({u, v});
            } else {
                low[u] = min(low[u], disc[v]);
            }
        }
    }
    
public:
    vector<vector<int>> criticalConnections(int n, vector<vector<int>>& connections) {
        graph.resize(n);
        disc.assign(n, -1);
        low.resize(n);
        for (auto& e : connections) {
            graph[e[0]].push_back(e[1]);
            graph[e[1]].push_back(e[0]);
        }
        dfs(0, -1);
        return bridges;
    }
};`,
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V + E)",
    patternGuide: "Use **Tarjan's algorithm (disc + low)** when:\n- Finding bridges (critical edges) or articulation points\n- Detecting strongly connected components\n- Graph connectivity under edge/node removal\n\nSimilar: Articulation Points, Strongly Connected Components, Biconnected Components"
},
{
    id: 147,
    lcNumber: 1354,
    title: "Construct Target Array With Multiple Sums",
    difficulty: "Hard",
    category: "Greedy",
    description: "You are given an array `target` of `n` integers. Starting from `arr = [1, 1, ..., 1]`, in one step you can pick index `i` and replace `arr[i]` with the sum of all elements in `arr`. Return true if you can construct `target` from `arr`.",
    examples: [
        "Input: target = [9,3,5]\nOutput: true\nExplanation: [1,1,1] → [1,1,3] → [1,3,5] → [9,3,5]",
        "Input: target = [1,1,1,2]\nOutput: false"
    ],
    thinkingProcess: [
        { step: "Work backwards", detail: "Forward: exponential choices. Backward: the largest element must have been the one replaced last (since it equals the sum of all others + its original value). There's only one possibility at each step." },
        { step: "Reverse operation", detail: "If the current max is `M` and the sum of everything else is `rest`, then before the last operation, this position had value `M - rest`. The new max is M - rest." },
        { step: "Use a max-heap", detail: "The largest element is always the most recently replaced. Pop the max from a heap, compute its previous value, push it back. Repeat until all elements are 1, or detect impossibility." },
        { step: "Optimization: use modulo for large values", detail: "If max >> rest (e.g., max=10^9, rest=3), subtracting rest one at a time is too slow. Use modulo: `prev = max % rest`. Multiple operations are done at once." },
        { step: "Termination and impossible cases", detail: "If `rest == 0` or `rest == 1` or `max < rest` or `max % rest == 0` (and rest > 1): impossible. If rest == 1: we can always reach [1,1,...,1]. If max becomes 1, we're done." },
        { step: "Edge cases", detail: "n=1: target must be [1]. Any element already 1: skip it. Rest=1: max%1=0, so prev=max%rest, but 0 isn't valid — handle separately (prev = rest when remainder is 0)." }
    ],
    keyInsight: "Work backwards: the largest element was the last to be replaced. Its previous value = max - rest_sum. Use a max-heap and modulo for efficiency. If any value becomes < 1 or rest = 0 (stuck), return false. Continue until all values are 1.",
    approach: "1. Max-heap of target values.\n2. Pop max, compute rest = total - max.\n3. Previous value = max % rest (with edge cases).\n4. Push previous value back, update total.\n5. Continue until all are 1 or detect impossible.",
    solutionPython: `import heapq

def isPossible(target):
    if len(target) == 1:
        return target[0] == 1
    
    total = sum(target)
    heap = [-x for x in target]  # max-heap via negation
    heapq.heapify(heap)
    
    while True:
        mx = -heapq.heappop(heap)
        if mx == 1:
            return True
        
        rest = total - mx
        if rest == 0 or rest >= mx:
            return False
        
        # Use modulo to skip multiple subtractions
        prev = mx % rest
        if prev == 0:
            # prev would be rest (or invalid)
            if rest == 1:
                return True
            return False
        
        total = total - mx + prev
        heapq.heappush(heap, -prev)`,
    solutionCpp: `#include <vector>
#include <queue>
#include <numeric>
using namespace std;

bool isPossible(vector<int>& target) {
    if (target.size() == 1) return target[0] == 1;
    
    long long total = accumulate(target.begin(), target.end(), 0LL);
    priority_queue<long long> pq(target.begin(), target.end());
    
    while (true) {
        long long mx = pq.top(); pq.pop();
        if (mx == 1) return true;
        
        long long rest = total - mx;
        if (rest == 0 || rest >= mx) return false;
        
        long long prev = mx % rest;
        if (prev == 0) {
            if (rest == 1) return true;
            return false;
        }
        
        total = total - mx + prev;
        pq.push(prev);
    }
}`,
    timeComplexity: "O(n log n × log(max_val))",
    spaceComplexity: "O(n)",
    patternGuide: "Use **reverse simulation with max-heap** when:\n- Forward direction has many choices, backward is unique\n- The largest element determines the last operation\n- Use modulo to skip repeated subtractions\n\nSimilar: Reaching Points, Broken Calculator"
},
{
    id: 148,
    lcNumber: 214,
    title: "Shortest Palindrome",
    difficulty: "Hard",
    category: "String",
    description: "Given a string `s`, you can convert it to a palindrome by adding characters in front of it. Return the SHORTEST such palindrome.",
    examples: [
        "Input: s = \"aacecaaa\"\nOutput: \"aaacecaaa\"\nExplanation: prepend a single 'a'.",
        "Input: s = \"abcd\"\nOutput: \"dcbabcd\"\nExplanation: prepend 'dcb'."
    ],
    thinkingProcess: [
        { step: "Reformulate the problem", detail: "To make `s` a palindrome by prepending the FEWEST characters, we want to find the LONGEST palindromic prefix of `s`. Whatever follows it is the 'tail' — we mirror that tail and prepend it." },
        { step: "Naive: shrink from the right", detail: "For length L = len(s) down to 0, check if s[0:L] is a palindrome. The first hit is our longest palindromic prefix. O(n²) total — works but slow on n=50000." },
        { step: "KMP insight: build a string that encodes both halves", detail: "Construct `T = s + '#' + reverse(s)`. Run the KMP failure (LPS) function on T. The final LPS value tells us the longest proper prefix of T that is also a suffix — and by construction, this equals the longest prefix of `s` that is a palindrome." },
        { step: "Why the separator '#' matters", detail: "Without it, the LPS could 'overshoot' and match characters that span both halves, giving a wrong answer. The separator (any char not in s) ensures the matched prefix lies entirely within `s` and the matched suffix lies entirely within `reverse(s)`." },
        { step: "Construct the answer", detail: "Let `k` = length of longest palindromic prefix found. The remaining suffix `s[k:]` needs to be mirrored and prepended: `answer = reverse(s[k:]) + s`. Total length: `n + (n - k)`." },
        { step: "Complexity", detail: "Building T is O(n). Computing LPS is O(n). Total time and space O(n) — optimal." }
    ],
    keyInsight: "Find the LONGEST palindromic PREFIX of s, then mirror the rest and prepend. Use KMP on the combined string `s + '#' + reverse(s)` — its final LPS value equals the length of that longest palindromic prefix in O(n) time.",
    approach: "1. Build T = s + '#' + reverse(s).\n2. Compute LPS array of T via KMP.\n3. k = LPS[len(T)-1] = length of longest palindromic prefix of s.\n4. Return reverse(s[k:]) + s.",
    solutionPython: `def shortestPalindrome(s):
    if not s:
        return s
    rev = s[::-1]
    T = s + '#' + rev
    n = len(T)

    # KMP longest-prefix-suffix array
    lps = [0] * n
    for i in range(1, n):
        j = lps[i - 1]
        while j > 0 and T[i] != T[j]:
            j = lps[j - 1]
        if T[i] == T[j]:
            j += 1
        lps[i] = j

    k = lps[-1]              # longest palindromic prefix length
    return rev[: len(s) - k] + s`,
    solutionCpp: `#include <string>
#include <vector>
using namespace std;

string shortestPalindrome(string s) {
    if (s.empty()) return s;
    string rev(s.rbegin(), s.rend());
    string T = s + "#" + rev;
    int n = T.size();

    vector<int> lps(n, 0);
    for (int i = 1; i < n; i++) {
        int j = lps[i - 1];
        while (j > 0 && T[i] != T[j]) j = lps[j - 1];
        if (T[i] == T[j]) j++;
        lps[i] = j;
    }

    int k = lps[n - 1];
    return rev.substr(0, s.size() - k) + s;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    patternGuide: "Use **KMP failure function on s + '#' + reverse(s)** when:\n- You need the longest palindromic PREFIX (or suffix) of a string\n- Want O(n) instead of O(n²) palindrome scanning\n- Pattern matching with implicit reflection\n\nSimilar: Longest Happy Prefix (LC 1392), Find the Index of the First Occurrence (KMP), Longest Palindromic Substring"
},
{
    id: 149,
    lcNumber: 632,
    title: "Smallest Range Covering Elements from K Lists",
    difficulty: "Hard",
    category: "Heap / Priority Queue",
    description: "You have `k` sorted lists of integers. Find the smallest range [a, b] that includes at least one number from each of the `k` lists.",
    examples: [
        "Input: nums = [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]\nOutput: [20,24]\nExplanation: List 0: 24, List 1: 20, List 2: 22. Range [20,24] covers all three.",
        "Input: nums = [[1,2,3],[1,2,3],[1,2,3]]\nOutput: [1,1]"
    ],
    thinkingProcess: [
        { step: "Understand: sliding window over k sorted lists", detail: "We need one element from each list, and the range (max - min of chosen elements) should be minimized. This is like k pointers, one per list, and we want to minimize the range they span." },
        { step: "Min-heap approach", detail: "Initialize: one pointer at the start of each list. Push all k starting elements into a min-heap. Track the current max. The range is [heap.min, current_max]." },
        { step: "Advance the minimum", detail: "The only way to shrink the range is to increase the minimum. Pop the min element, advance that list's pointer, push the next element. Update max if the new element is larger. Recompute range." },
        { step: "When to stop", detail: "Stop when any list is exhausted (no more elements to push from that list). We can't include an element from that list anymore." },
        { step: "Why this finds the optimal", detail: "At each step, the min-heap holds exactly one element per list (the current candidate). Advancing the minimum is the only move that could reduce the range. Any valid range must have its minimum ≥ some min-heap state we consider." },
        { step: "Track best range", detail: "At each step, compare [heap_min, current_max] with the best range seen. Update if smaller (or same size but smaller start)." }
    ],
    keyInsight: "Min-heap with one element per list. The range is [heap.min, current_max]. To shrink the range, advance the minimum (pop from heap, push next from that list). Track max separately. Stop when any list is exhausted. This is the k-pointer sliding window technique.",
    approach: "1. Push first element of each list into min-heap.\n2. Track current max.\n3. Range = [heap.min, max].\n4. Pop min, advance that list's pointer, push next.\n5. Update max and best range.\n6. Stop when any list exhausted.",
    solutionPython: `import heapq

def smallestRange(nums):
    k = len(nums)
    heap = []
    cur_max = float('-inf')
    
    # Initialize: push first element of each list
    for i in range(k):
        heapq.heappush(heap, (nums[i][0], i, 0))
        cur_max = max(cur_max, nums[i][0])
    
    best = [heap[0][0], cur_max]
    
    while True:
        val, list_idx, elem_idx = heapq.heappop(heap)
        
        # Check if this gives a better range
        if cur_max - val < best[1] - best[0]:
            best = [val, cur_max]
        
        # Advance pointer in this list
        if elem_idx + 1 == len(nums[list_idx]):
            break  # list exhausted
        
        next_val = nums[list_idx][elem_idx + 1]
        heapq.heappush(heap, (next_val, list_idx, elem_idx + 1))
        cur_max = max(cur_max, next_val)
    
    return best`,
    solutionCpp: `#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

vector<int> smallestRange(vector<vector<int>>& nums) {
    // {value, list_index, element_index}
    auto cmp = [](auto& a, auto& b) { return get<0>(a) > get<0>(b); };
    priority_queue<tuple<int,int,int>, vector<tuple<int,int,int>>, decltype(cmp)> pq(cmp);
    
    int curMax = INT_MIN;
    for (int i = 0; i < (int)nums.size(); i++) {
        pq.push({nums[i][0], i, 0});
        curMax = max(curMax, nums[i][0]);
    }
    
    vector<int> best = {get<0>(pq.top()), curMax};
    
    while (true) {
        auto [val, li, ei] = pq.top(); pq.pop();
        if (curMax - val < best[1] - best[0])
            best = {val, curMax};
        
        if (ei + 1 == (int)nums[li].size()) break;
        
        int nv = nums[li][ei + 1];
        pq.push({nv, li, ei + 1});
        curMax = max(curMax, nv);
    }
    return best;
}`,
    timeComplexity: "O(n × log k) where n = total elements",
    spaceComplexity: "O(k)",
    patternGuide: "Use **k-pointer min-heap** when:\n- Need to merge/compare across k sorted lists\n- Advancing the minimum pointer reduces the range\n- Finding optimal window spanning k sources\n\nSimilar: Merge K Sorted Lists, Kth Smallest in Sorted Matrix"
},
{
    id: 150,
    lcNumber: 765,
    title: "Couples Holding Hands",
    difficulty: "Hard",
    category: "Greedy",
    description: "There are `n` couples sitting in `2n` seats in a row. Couple `i` consists of persons `2i` and `2i+1`. Return the minimum number of swaps so that every couple is sitting side by side. A swap consists of choosing any two people and swapping their seats.",
    examples: [
        "Input: row = [0,2,1,3]\nOutput: 1\nExplanation: Swap row[1] and row[2]. Result: [0,1,2,3]. Couples (0,1) and (2,3) are adjacent.",
        "Input: row = [3,2,0,1]\nOutput: 0\nExplanation: Couples (2,3) and (0,1) are already adjacent."
    ],
    thinkingProcess: [
        { step: "Greedy: fix pairs left to right", detail: "Process seats two at a time (positions 0-1, 2-3, ...). For each pair of seats, check if they hold a couple. If not, find the partner of the person in the left seat and swap them in." },
        { step: "Finding the partner", detail: "Person `p`'s partner is `p ^ 1` (XOR with 1). If p is even, partner is p+1. If p is odd, partner is p-1. XOR toggles the last bit." },
        { step: "Maintain a position map", detail: "Keep a map: person → current seat index. This lets us find the partner's position in O(1). Update the map after each swap." },
        { step: "Why greedy is optimal", detail: "Each swap fixes at least one couple. In the worst case, we need exactly one swap per mismatched pair. The greedy approach of fixing from left to right never makes things worse — once a pair is fixed, it stays fixed." },
        { step: "Proof of optimality", detail: "Think of it as a graph: each mismatched couple pair forms a cycle. A cycle of length k needs k-1 swaps. Greedy breaks cycles optimally. Total swaps = total pairs - number of cycles." },
        { step: "Alternative: Union Find", detail: "Union seats (i, i+1) for each pair position. Union persons (2k, 2k+1) for each couple. Count connected components. Swaps = n - components. Both approaches give the same answer." }
    ],
    keyInsight: "Greedy: process pairs of seats left to right. For each pair, if they don't hold a couple, find the partner (via XOR: `p^1`) and swap them in. Each swap fixes exactly one couple. Total swaps = number of mismatched pairs. Position map enables O(1) lookup.",
    approach: "1. Build position map: person → seat index.\n2. For each pair of seats (0-1, 2-3, ...):\n   - Check if row[2i] and row[2i+1] are a couple.\n   - If not, find partner of row[2i], swap them into seat 2i+1.\n   - Update position map.\n3. Count swaps.",
    solutionPython: `def minSwapsCouples(row):
    n = len(row)
    pos = {person: i for i, person in enumerate(row)}
    swaps = 0
    
    for i in range(0, n, 2):
        partner = row[i] ^ 1  # XOR to find partner
        
        if row[i + 1] != partner:
            # Find where the partner is
            j = pos[partner]
            
            # Swap row[i+1] and row[j]
            pos[row[i + 1]] = j
            pos[partner] = i + 1
            row[i + 1], row[j] = row[j], row[i + 1]
            
            swaps += 1
    
    return swaps`,
    solutionCpp: `#include <vector>
using namespace std;

int minSwapsCouples(vector<int>& row) {
    int n = row.size();
    vector<int> pos(n);
    for (int i = 0; i < n; i++) pos[row[i]] = i;
    
    int swaps = 0;
    for (int i = 0; i < n; i += 2) {
        int partner = row[i] ^ 1;
        if (row[i + 1] != partner) {
            int j = pos[partner];
            pos[row[i + 1]] = j;
            pos[partner] = i + 1;
            swap(row[i + 1], row[j]);
            swaps++;
        }
    }
    return swaps;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    patternGuide: "Use **greedy fix-in-place with position map** when:\n- Pairing/matching elements that should be adjacent\n- Each swap fixes at least one pair\n- Position map enables O(1) partner lookup\n\nSimilar: Minimum Swaps to Sort, First Missing Positive, Cyclic Sort"
},
// ============================================================
// CATEGORY: DESIGN — Additional Design Patterns (Problems 151-160)
// ============================================================
{
    id: 151,
    lcNumber: 706,
    title: "Design HashMap",
    difficulty: "Easy",
    category: "Design",
    description: "Design a HashMap without using any built-in hash table libraries. Implement `put(key, value)`, `get(key)` (returns -1 if not found), and `remove(key)`.",
    examples: [
        "put(1,1), put(2,2), get(1)→1, get(3)→-1, put(2,1), get(2)→1, remove(2), get(2)→-1"
    ],
    thinkingProcess: [
        { step: "Core idea: array + hash function", detail: "Allocate a fixed array of buckets. Use `hash(key) = key % BUCKETS` to map a key to a bucket index. The challenge: collisions — two different keys may map to the same bucket." },
        { step: "Resolve collisions via separate chaining", detail: "Each bucket stores a list (linked list or array) of `(key, value)` pairs. To put/get/remove, hash to the bucket, then linearly scan that bucket's list for the key." },
        { step: "Choosing bucket count", detail: "Pick a prime number (e.g., 769) to spread keys evenly and reduce clustering. Load factor ≈ N/buckets stays low → O(1) average per operation." },
        { step: "Put logic", detail: "Hash key → walk bucket. If key exists, update value. Else append new pair to the bucket." },
        { step: "Get & remove logic", detail: "Hash key → walk bucket. Return value if found (else -1). Remove: splice the matching pair out of the bucket list." },
        { step: "Alternative: open addressing", detail: "Could also use linear/quadratic probing with a flat array — fewer pointers but harder to delete (need tombstones). Separate chaining is simpler and the standard interview answer." }
    ],
    keyInsight: "Hash function maps keys to a fixed array of buckets; resolve collisions with separate chaining (a list per bucket). Hash → bucket → linear scan. With a prime bucket count and a good hash, all operations are O(1) average.",
    approach: "1. Array of `BUCKETS` lists (separate chaining).\n2. `hash(k) = k % BUCKETS`.\n3. put/get/remove: hash, then scan that bucket's list.",
    solutionPython: `class MyHashMap:
    def __init__(self):
        self.BUCKETS = 769  # prime
        self.buckets = [[] for _ in range(self.BUCKETS)]

    def _bucket(self, key):
        return self.buckets[key % self.BUCKETS]

    def put(self, key, value):
        bucket = self._bucket(key)
        for i, (k, _) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)
                return
        bucket.append((key, value))

    def get(self, key):
        for k, v in self._bucket(key):
            if k == key:
                return v
        return -1

    def remove(self, key):
        bucket = self._bucket(key)
        for i, (k, _) in enumerate(bucket):
            if k == key:
                bucket.pop(i)
                return`,
    solutionCpp: `class MyHashMap {
    static const int BUCKETS = 769;
    vector<list<pair<int,int>>> buckets;

    list<pair<int,int>>& bucket(int key) { return buckets[key % BUCKETS]; }
public:
    MyHashMap() : buckets(BUCKETS) {}

    void put(int key, int value) {
        for (auto& kv : bucket(key))
            if (kv.first == key) { kv.second = value; return; }
        bucket(key).push_back({key, value});
    }

    int get(int key) {
        for (auto& kv : bucket(key))
            if (kv.first == key) return kv.second;
        return -1;
    }

    void remove(int key) {
        auto& b = bucket(key);
        for (auto it = b.begin(); it != b.end(); ++it)
            if (it->first == key) { b.erase(it); return; }
    }
};`,
    timeComplexity: "O(1) average, O(N) worst per op",
    spaceComplexity: "O(N + BUCKETS)",
    patternGuide: "Use **separate chaining hash table** when:\n- Building hash map / set from scratch\n- Need predictable O(1) average with simple deletion\n- Collisions are rare with a good hash + load factor\n\nSimilar: Design HashSet (LC 705), LRU Cache, Design HashMap with TTL"
},
{
    id: 152,
    lcNumber: 1472,
    title: "Design Browser History",
    difficulty: "Medium",
    category: "Design",
    description: "Implement a browser history with: `visit(url)` (clears forward history), `back(steps)` (go back up to `steps` pages, return current URL), `forward(steps)` (go forward up to `steps` pages, return current URL).",
    examples: [
        "BrowserHistory(\"leet.com\"), visit(\"google.com\"), visit(\"fb.com\"), visit(\"yt.com\")\nback(1) → \"fb.com\"\nback(1) → \"google.com\"\nforward(1) → \"fb.com\"\nvisit(\"linkedin.com\") (clears forward stack)\nforward(2) → \"linkedin.com\" (no forward history)\nback(2) → \"google.com\"\nback(7) → \"leet.com\""
    ],
    thinkingProcess: [
        { step: "Model history as a tape with a cursor", detail: "Visualize a sequential list of URLs with a pointer to the current page. `back`/`forward` move the pointer. `visit` appends a new URL just after the cursor and discards everything beyond." },
        { step: "Why a single array beats two stacks here", detail: "Two-stack solution works (back-stack + forward-stack), but `back(steps)` and `forward(steps)` would require popping/pushing many elements. With an array + index pointer, `back/forward` are O(1)." },
        { step: "visit invalidates forward history", detail: "When `visit(url)` is called from position `i`, set `history[i+1] = url` and truncate length to `i+2`. This mirrors real browsers — once you navigate to a new page, the forward history is gone." },
        { step: "back/forward bound checks", detail: "`back(steps)`: `i = max(0, i - steps)`. `forward(steps)`: `i = min(len-1, i + steps)`. Return `history[i]`." },
        { step: "Memory note", detail: "We don't actually pop elements on visit — we just shrink the logical length. Could either truncate the list (Python `del`) or maintain a `size` field for amortized speed." }
    ],
    keyInsight: "Treat history as a single array + cursor index. `visit` overwrites the slot after the cursor and shrinks the logical size (drops forward history). `back`/`forward` just clamp the index — O(1) regardless of step count, beating the two-stack approach.",
    approach: "1. `history[]` + `cur` index + `size`.\n2. `visit`: `history[++cur] = url; size = cur + 1`.\n3. `back(s)`: `cur = max(0, cur - s)`.\n4. `forward(s)`: `cur = min(size-1, cur + s)`.",
    solutionPython: `class BrowserHistory:
    def __init__(self, homepage):
        self.history = [homepage]
        self.cur = 0
        self.size = 1

    def visit(self, url):
        self.cur += 1
        if self.cur < len(self.history):
            self.history[self.cur] = url
        else:
            self.history.append(url)
        self.size = self.cur + 1  # drop forward history

    def back(self, steps):
        self.cur = max(0, self.cur - steps)
        return self.history[self.cur]

    def forward(self, steps):
        self.cur = min(self.size - 1, self.cur + steps)
        return self.history[self.cur]`,
    solutionCpp: `class BrowserHistory {
    vector<string> history;
    int cur = 0, sz = 1;
public:
    BrowserHistory(string homepage) : history{homepage} {}

    void visit(string url) {
        ++cur;
        if (cur < (int)history.size()) history[cur] = url;
        else history.push_back(url);
        sz = cur + 1;
    }

    string back(int steps) {
        cur = max(0, cur - steps);
        return history[cur];
    }

    string forward(int steps) {
        cur = min(sz - 1, cur + steps);
        return history[cur];
    }
};`,
    timeComplexity: "O(1) per op",
    spaceComplexity: "O(N) total URLs",
    patternGuide: "Use **array + cursor pointer** when:\n- Bidirectional navigation through a sequence\n- Branch-and-truncate semantics (undo/redo, browser nav)\n- Step counts may be large → avoid stack push/pop loops\n\nSimilar: Design Text Editor, Implement Undo/Redo, Memento Pattern"
},
{
    id: 153,
    lcNumber: 855,
    title: "Exam Room",
    difficulty: "Medium",
    category: "Design",
    description: "There are `n` seats in a row (0 to n-1). Implement: `seat()` — seat a student so the distance to the closest other student is MAXIMIZED, breaking ties by smallest index (seat 0 if room is empty); `leave(p)` — the student in seat p leaves.",
    examples: [
        "ExamRoom(10)\nseat() → 0\nseat() → 9      // farthest from 0\nseat() → 4      // middle of [0, 9]\nseat() → 2      // middle of [0, 4]\nleave(4)\nseat() → 5      // middle of [2, 9]"
    ],
    thinkingProcess: [
        { step: "Model occupied seats as a sorted set", detail: "What matters for `seat()` is the GAPS between occupied seats — specifically, the gap that yields the largest 'distance to nearest neighbor'. Maintain occupied seats in a sorted structure for O(log n) insertion / deletion / neighbor queries." },
        { step: "Compute the best new position", detail: "Walk through consecutive occupied pairs (a, b). The midpoint `(a+b)/2` gives a candidate distance `(b-a)/2`. Also consider the two endpoints: distance from seat 0 to the first occupied, and from the last occupied to seat n-1." },
        { step: "Tie-break by smallest index", detail: "If two candidates give the same distance, pick the one with the smaller seat index. Iterate left-to-right and only update when STRICTLY better — the first one wins ties naturally." },
        { step: "Edge case: empty room", detail: "If no one is seated, return seat 0 (problem rule: prefer smallest index)." },
        { step: "leave(p) is trivial", detail: "Just remove `p` from the sorted set — O(log n) with TreeSet / SortedList." },
        { step: "Complexity", detail: "`seat()` walks all gaps in the sorted set: O(K) where K = currently seated. `leave()` is O(log K). Total worst-case O(N²) over N seats — acceptable for typical constraints. A heap-of-gaps version reaches O(log N) per op but needs lazy deletion." }
    ],
    keyInsight: "Maintain occupied seats in a SortedList. For `seat()`, scan adjacent occupied pairs and compute candidate distances — including the two endpoints (seat 0 and seat n-1). Pick the position with maximum distance, breaking ties by smallest index. `leave()` is just a remove.",
    approach: "1. SortedList `seats` of occupied positions.\n2. seat(): if empty → return 0. Else compute best candidate from endpoints + gap midpoints, insert and return.\n3. leave(p): seats.remove(p).",
    solutionPython: `from sortedcontainers import SortedList

class ExamRoom:
    def __init__(self, n):
        self.n = n
        self.seats = SortedList()

    def seat(self):
        if not self.seats:
            self.seats.add(0)
            return 0

        # Candidate 1: seat 0 (distance to first occupied)
        best_dist = self.seats[0]
        best_pos = 0

        # Candidate 2: midpoints between adjacent occupied seats
        for i in range(len(self.seats) - 1):
            a, b = self.seats[i], self.seats[i + 1]
            d = (b - a) // 2
            if d > best_dist:
                best_dist = d
                best_pos = a + d

        # Candidate 3: last seat (distance from last occupied)
        if (self.n - 1) - self.seats[-1] > best_dist:
            best_pos = self.n - 1

        self.seats.add(best_pos)
        return best_pos

    def leave(self, p):
        self.seats.remove(p)`,
    solutionCpp: `class ExamRoom {
    int n;
    set<int> seats;
public:
    ExamRoom(int n) : n(n) {}

    int seat() {
        if (seats.empty()) { seats.insert(0); return 0; }

        int bestDist = *seats.begin();   // distance from 0
        int bestPos = 0;

        int prev = -1;
        for (int s : seats) {
            if (prev != -1) {
                int d = (s - prev) / 2;
                if (d > bestDist) { bestDist = d; bestPos = prev + d; }
            }
            prev = s;
        }

        if ((n - 1) - *seats.rbegin() > bestDist) bestPos = n - 1;

        seats.insert(bestPos);
        return bestPos;
    }

    void leave(int p) { seats.erase(p); }
};`,
    timeComplexity: "O(K) seat, O(log K) leave (K = currently seated)",
    spaceComplexity: "O(K)",
    patternGuide: "Use **sorted set of occupied positions** when:\n- Need to maximize/minimize distance to nearest neighbor\n- Insert/remove single points and query gaps\n- Endpoint cases must be considered separately\n\nSimilar: My Calendar I/II/III, Range Module, Seat Reservation Manager"
},
{
    id: 154,
    lcNumber: 362,
    title: "Design Hit Counter",
    difficulty: "Medium",
    category: "Design",
    description: "Design a hit counter that supports `hit(timestamp)` and `getHits(timestamp)` returning the number of hits in the past 5 minutes (300 seconds, inclusive of `timestamp`). Hits arrive in chronological order.",
    examples: [
        "hit(1), hit(2), hit(3)\ngetHits(4) → 3\nhit(300)\ngetHits(300) → 4\ngetHits(301) → 3 (hit at t=1 expired)"
    ],
    thinkingProcess: [
        { step: "Naive: queue of timestamps", detail: "Push each hit's timestamp on a queue. On `getHits(t)`, pop from the front while front ≤ t-300. Return queue size. Works but uses O(N) space if many hits per second." },
        { step: "Bucketed approach (interview-preferred)", detail: "Allocate two parallel arrays of size 300: `times[i]` = the latest second mapped to bucket i (`t % 300`), `counts[i]` = hits in that bucket. This gives O(1) memory regardless of hit volume." },
        { step: "hit(t) logic", detail: "Compute `i = t % 300`. If `times[i] != t`, this slot is stale — overwrite with `times[i] = t, counts[i] = 1`. Else increment `counts[i]`." },
        { step: "getHits(t) logic", detail: "Sum `counts[i]` for every bucket where `t - times[i] < 300` (still within the 5-minute window). Bucket with `times[i] == t - 300 + 1` … `t` are valid; older are stale." },
        { step: "Why this works", detail: "Each second maps to exactly one bucket. As time advances past a bucket's owner second by 300+, the next hit at that index simply overwrites it — natural circular buffer with lazy invalidation. Constant time, constant space." },
        { step: "Concurrency follow-up", detail: "Interviewer often asks: what if hits come from many threads? Add a lock per bucket, or use atomic counters. For very high QPS, shard the counter by thread ID." }
    ],
    keyInsight: "Use two fixed-size arrays of length 300 indexed by `t % 300` — one stores the latest second written to that slot, the other its hit count. Old buckets are lazily overwritten on next hit. O(1) time, O(300) space, regardless of hit frequency.",
    approach: "1. `times[300]`, `counts[300]`.\n2. hit(t): i = t%300; if times[i]≠t reset, else ++counts[i].\n3. getHits(t): sum counts[i] where t-times[i] < 300.",
    solutionPython: `class HitCounter:
    def __init__(self):
        self.times = [0] * 300
        self.counts = [0] * 300

    def hit(self, timestamp):
        i = timestamp % 300
        if self.times[i] != timestamp:
            self.times[i] = timestamp
            self.counts[i] = 1
        else:
            self.counts[i] += 1

    def getHits(self, timestamp):
        return sum(c for t, c in zip(self.times, self.counts)
                   if timestamp - t < 300)`,
    solutionCpp: `class HitCounter {
    vector<int> times, counts;
public:
    HitCounter() : times(300, 0), counts(300, 0) {}

    void hit(int timestamp) {
        int i = timestamp % 300;
        if (times[i] != timestamp) { times[i] = timestamp; counts[i] = 1; }
        else                       { counts[i]++; }
    }

    int getHits(int timestamp) {
        int total = 0;
        for (int i = 0; i < 300; i++)
            if (timestamp - times[i] < 300) total += counts[i];
        return total;
    }
};`,
    timeComplexity: "O(1) hit, O(300) getHits",
    spaceComplexity: "O(300)",
    patternGuide: "Use **bucketed circular buffer with lazy invalidation** when:\n- Sliding-window count over fixed time horizon\n- Need bounded memory regardless of event volume\n- Each time unit has a deterministic slot\n\nSimilar: Logger Rate Limiter, Sliding Window Rate Limiter, Time-Series Rolling Stats"
},
{
    id: 155,
    lcNumber: 379,
    title: "Design Phone Directory",
    difficulty: "Medium",
    category: "Design",
    description: "Design a phone directory with `maxNumbers` slots. Implement `get()` (provide an unused number, -1 if none), `check(number)` (true if available), and `release(number)` (return it to the pool).",
    examples: [
        "PhoneDirectory(3)\nget() → 0, get() → 1, check(2) → true, get() → 2\ncheck(2) → false, release(2), check(2) → true"
    ],
    thinkingProcess: [
        { step: "What operations does this resemble?", detail: "An object pool: a fixed set of resources (numbers) checked out and returned. `get` should be O(1), `check` should be O(1), `release` should be O(1)." },
        { step: "Naive: boolean array", detail: "`available[i]` = true/false. `get` scans for the first free slot → O(N). Too slow if `get` is hot." },
        { step: "Pool of available IDs (queue/stack)", detail: "Maintain a `Set` of free numbers (for O(1) `check`) plus a `Queue` (or `Stack`) of free numbers (for O(1) `get`). On `release`, push back into both." },
        { step: "get / check / release", detail: "get: pop from queue, remove from set, return. check: set.contains(n). release: only re-add if not already free (idempotent guard)." },
        { step: "Why both a set and a queue", detail: "The queue gives O(1) 'pick any free one'; the set gives O(1) membership. A single `LinkedHashSet` could combine both — interviewers love that follow-up." }
    ],
    keyInsight: "Treat the directory as an object pool. Maintain a queue of free numbers (for O(1) acquisition) AND a set of free numbers (for O(1) membership / idempotent release). All three operations become O(1).",
    approach: "1. Initialize queue + set with [0..maxNumbers-1].\n2. get: dequeue, set.remove, return.\n3. check: set.contains(n).\n4. release: if n not in set → enqueue + add.",
    solutionPython: `from collections import deque

class PhoneDirectory:
    def __init__(self, maxNumbers):
        self.available = set(range(maxNumbers))
        self.queue = deque(range(maxNumbers))

    def get(self):
        while self.queue and self.queue[0] not in self.available:
            self.queue.popleft()  # skip stale
        if not self.queue:
            return -1
        n = self.queue.popleft()
        self.available.remove(n)
        return n

    def check(self, number):
        return number in self.available

    def release(self, number):
        if number not in self.available:
            self.available.add(number)
            self.queue.append(number)`,
    solutionCpp: `class PhoneDirectory {
    unordered_set<int> available;
    queue<int> q;
public:
    PhoneDirectory(int maxNumbers) {
        for (int i = 0; i < maxNumbers; i++) {
            available.insert(i);
            q.push(i);
        }
    }

    int get() {
        while (!q.empty() && !available.count(q.front())) q.pop();
        if (q.empty()) return -1;
        int n = q.front(); q.pop();
        available.erase(n);
        return n;
    }

    bool check(int number) { return available.count(number) > 0; }

    void release(int number) {
        if (!available.count(number)) {
            available.insert(number);
            q.push(number);
        }
    }
};`,
    timeComplexity: "O(1) amortized per op",
    spaceComplexity: "O(maxNumbers)",
    patternGuide: "Use **object pool (set + queue)** when:\n- Allocating from a fixed pool of reusable resources\n- Need O(1) acquire, O(1) release, O(1) check\n- Common in connection pools, ID generators, port allocators\n\nSimilar: SnapshotArray, Encode/Decode TinyURL, Connection Pool"
},
{
    id: 156,
    lcNumber: 353,
    title: "Design Snake Game",
    difficulty: "Medium",
    category: "Design",
    description: "Design Snake. The game has width × height cells, a list of `food` positions (consumed in order), and a single `move(direction)` method returning the score, or -1 on game over. Snake grows by 1 after eating food. Game over on hitting wall or itself.",
    examples: [
        "SnakeGame(3, 2, [[1,2],[0,1]])\nmove(\"R\") → 0\nmove(\"D\") → 0\nmove(\"R\") → 1   // eats first food\nmove(\"U\") → 1\nmove(\"L\") → 2   // eats second\nmove(\"U\") → -1  // hits wall"
    ],
    thinkingProcess: [
        { step: "Represent the snake", detail: "A `deque` of cells from head to tail. The head is the front; the tail is the back. Each move pushes a new head; if no food, pop the tail. If food, keep the tail (snake grows)." },
        { step: "Compute new head", detail: "Direction → (dr, dc). New head = (head.r + dr, head.c + dc). Out of bounds → game over." },
        { step: "Self-collision check (the trick)", detail: "Check whether the new head collides with any cell in the body — but EXCLUDE the current tail, because if no food is eaten the tail will move away just in time. Use a hash set of body cells for O(1) lookup." },
        { step: "Food handling", detail: "Maintain a `foodIdx` pointer. If `newHead == food[foodIdx]`, increment foodIdx, score++, grow (don't pop tail). Else, pop tail (snake moves)." },
        { step: "Why deque + set", detail: "Deque gives O(1) push-front/pop-back for the snake. Set gives O(1) self-collision detection. Without the set, collision check is O(N) per move — too slow for tight grids." }
    ],
    keyInsight: "Model snake as a deque (head ⇆ tail) AND mirror its body in a hash set for O(1) collision checks. On each move, push new head; pop tail unless food is eaten. Crucial subtlety: ignore the current tail when checking self-collision — it'll vacate that cell unless we're growing.",
    approach: "1. deque snake + set body + foodIdx + score.\n2. move(d): compute new head; check walls.\n3. Eat food → grow; else pop tail.\n4. Check self-collision against body (excluding tail when not growing).",
    solutionPython: `from collections import deque

class SnakeGame:
    DIRS = {"U": (-1, 0), "D": (1, 0), "L": (0, -1), "R": (0, 1)}

    def __init__(self, width, height, food):
        self.w, self.h = width, height
        self.food = food
        self.fi = 0
        self.snake = deque([(0, 0)])
        self.body = {(0, 0)}
        self.score = 0

    def move(self, direction):
        dr, dc = self.DIRS[direction]
        hr, hc = self.snake[0]
        nr, nc = hr + dr, hc + dc

        # Wall collision
        if not (0 <= nr < self.h and 0 <= nc < self.w):
            return -1

        # Will we eat food this step?
        eats = self.fi < len(self.food) and [nr, nc] == self.food[self.fi]

        # Tail will vacate iff not eating
        tail = self.snake[-1]
        if not eats:
            self.snake.pop()
            self.body.discard(tail)

        # Self-collision check after tail removed
        if (nr, nc) in self.body:
            return -1

        self.snake.appendleft((nr, nc))
        self.body.add((nr, nc))

        if eats:
            self.fi += 1
            self.score += 1
        return self.score`,
    solutionCpp: `class SnakeGame {
    int w, h, fi = 0, score = 0;
    vector<vector<int>> food;
    deque<pair<int,int>> snake;
    set<pair<int,int>> body;
public:
    SnakeGame(int width, int height, vector<vector<int>>& food)
        : w(width), h(height), food(food) {
        snake.push_back({0,0});
        body.insert({0,0});
    }

    int move(string direction) {
        static unordered_map<char, pair<int,int>> dirs = {
            {'U',{-1,0}}, {'D',{1,0}}, {'L',{0,-1}}, {'R',{0,1}}
        };
        auto [dr, dc] = dirs[direction[0]];
        auto [hr, hc] = snake.front();
        int nr = hr + dr, nc = hc + dc;
        if (nr < 0 || nr >= h || nc < 0 || nc >= w) return -1;

        bool eats = fi < (int)food.size() &&
                    food[fi][0] == nr && food[fi][1] == nc;

        auto tail = snake.back();
        if (!eats) { snake.pop_back(); body.erase(tail); }

        if (body.count({nr, nc})) return -1;

        snake.push_front({nr, nc});
        body.insert({nr, nc});
        if (eats) { fi++; score++; }
        return score;
    }
};`,
    timeComplexity: "O(1) per move",
    spaceComplexity: "O(snake length)",
    patternGuide: "Use **deque + mirrored hash set** when:\n- Sequential structure with frequent head/tail mutation\n- Need O(1) membership in a dynamically changing set\n- Game-state simulation with collision checks\n\nSimilar: LRU Cache, Sliding Window Median, Tail-recursive simulation"
},
{
    id: 157,
    lcNumber: 1797,
    title: "Design Authentication Manager",
    difficulty: "Medium",
    category: "Design",
    description: "A token expires `timeToLive` seconds after creation/renewal. Implement `generate(tokenId, currentTime)`, `renew(tokenId, currentTime)` (refresh expiry if not yet expired), and `countUnexpiredTokens(currentTime)`.",
    examples: [
        "AuthenticationManager(5)\nrenew(\"aaa\", 1)        // no-op (token doesn't exist)\ngenerate(\"aaa\", 2)     // expires at 7\ncountUnexpired(6) → 1\ngenerate(\"bbb\", 7)     // expires at 12\nrenew(\"aaa\", 8)        // already expired (8 ≥ 7) → no-op\nrenew(\"bbb\", 10)       // refresh; expires at 15\ncountUnexpired(15) → 0"
    ],
    thinkingProcess: [
        { step: "Each token has a single piece of state: its expiry time", detail: "Store `tokens: id → expiryTime`. `generate` sets `expiry = currentTime + ttl`. `renew` checks the existing expiry and refreshes — but only if `currentTime < expiry`." },
        { step: "Lazy vs eager expiration", detail: "Eager: schedule a timer per token to delete on expiry — overkill, hard to scale. Lazy: never proactively delete; just compare expiry to currentTime when queried. Standard pattern for TTL caches." },
        { step: "countUnexpiredTokens — naive", detail: "Scan all tokens, count those with `expiry > currentTime`. O(N). Often acceptable, and the official solution." },
        { step: "Cleanup to bound memory", detail: "We can opportunistically delete expired tokens during the count to free memory: iterate, if expired drop it, else count it. Trades one extra pass for unbounded growth prevention." },
        { step: "Optimize with TreeMap (follow-up)", detail: "Group tokens by expiry time using a sorted map: `expiry → set of tokenIds`. `countUnexpiredTokens(t)` then sums sizes of buckets with `expiry > t` (or computes `total - sum of expired buckets` and trims). Lets us delete all expired entries at once. Useful when N is huge but rolling window is short." }
    ],
    keyInsight: "Lazy TTL: store only the expiry time per token, never run a timer. Compare to `currentTime` on read. Renew is a no-op if `currentTime >= expiry`. Optionally clean up expired entries opportunistically during `countUnexpiredTokens` to prevent unbounded memory growth.",
    approach: "1. dict tokens: id → expiry.\n2. generate: tokens[id] = t + ttl.\n3. renew: if id present and tokens[id] > t → refresh.\n4. count: prune expired, return count.",
    solutionPython: `class AuthenticationManager:
    def __init__(self, timeToLive):
        self.ttl = timeToLive
        self.tokens = {}  # id -> expiry

    def generate(self, tokenId, currentTime):
        self.tokens[tokenId] = currentTime + self.ttl

    def renew(self, tokenId, currentTime):
        exp = self.tokens.get(tokenId)
        if exp is not None and exp > currentTime:
            self.tokens[tokenId] = currentTime + self.ttl

    def countUnexpiredTokens(self, currentTime):
        # Lazy cleanup keeps memory bounded
        expired = [k for k, e in self.tokens.items() if e <= currentTime]
        for k in expired:
            del self.tokens[k]
        return len(self.tokens)`,
    solutionCpp: `class AuthenticationManager {
    int ttl;
    unordered_map<string, int> tokens; // id -> expiry
public:
    AuthenticationManager(int timeToLive) : ttl(timeToLive) {}

    void generate(string tokenId, int currentTime) {
        tokens[tokenId] = currentTime + ttl;
    }

    void renew(string tokenId, int currentTime) {
        auto it = tokens.find(tokenId);
        if (it != tokens.end() && it->second > currentTime)
            it->second = currentTime + ttl;
    }

    int countUnexpiredTokens(int currentTime) {
        for (auto it = tokens.begin(); it != tokens.end(); ) {
            if (it->second <= currentTime) it = tokens.erase(it);
            else ++it;
        }
        return tokens.size();
    }
};`,
    timeComplexity: "O(1) generate/renew, O(N) count",
    spaceComplexity: "O(active tokens)",
    patternGuide: "Use **lazy TTL expiration** when:\n- Resources have a relative expiry (sessions, JWTs, cache entries)\n- Per-resource timers are too expensive\n- Cleanup can piggyback on read operations\n\nSimilar: Logger Rate Limiter, TTL Cache, Session Store"
},
{
    id: 158,
    lcNumber: 2353,
    title: "Design a Food Rating System",
    difficulty: "Medium",
    category: "Design",
    description: "Each food has a cuisine and a rating. Implement `changeRating(food, newRating)` and `highestRated(cuisine)` returning the food with the highest rating in that cuisine, breaking ties lexicographically.",
    examples: [
        "FoodRatings([\"kimchi\",\"miso\",\"sushi\",\"moussaka\",\"ramen\",\"bulgogi\"],\n             [\"korean\",\"japanese\",\"japanese\",\"greek\",\"japanese\",\"korean\"],\n             [9,12,8,15,14,7])\nhighestRated(\"korean\")   → \"kimchi\"\nhighestRated(\"japanese\") → \"ramen\"\nchangeRating(\"sushi\", 16)\nhighestRated(\"japanese\") → \"sushi\"\nchangeRating(\"ramen\", 16)\nhighestRated(\"japanese\") → \"ramen\"  // tie → lex smaller"
    ],
    thinkingProcess: [
        { step: "Two lookups dominate", detail: "We need (a) given a food, find its cuisine + current rating; (b) given a cuisine, find the top-rated food. So we need maps in both directions." },
        { step: "Per-food metadata", detail: "`foodInfo: food → (cuisine, rating)`. Updated in O(1) on changeRating." },
        { step: "Per-cuisine ordering — naïve heap with lazy deletion", detail: "Use a max-heap per cuisine, push (-rating, food). On highestRated, pop entries whose stored rating doesn't match the current rating in `foodInfo` (stale entries) until the top is fresh. Push new entry on every changeRating. O(log N) amortized." },
        { step: "Tie-break by lexicographic order", detail: "Heap key = (-rating, food). Negative rating gives max-rating-first; food string ascending gives lexicographic tie-break naturally." },
        { step: "Why lazy deletion is the trick", detail: "Removing a specific entry from a heap is O(N). Instead, keep stale entries; only validate them when they bubble to the top. Memory grows with edits but stays correct. (Alternative: use a SortedSet/TreeSet keyed on (-rating, food) for true O(log N) deletes.)" }
    ],
    keyInsight: "Per-food map gives O(1) rating updates; per-cuisine max-heap of (-rating, food) gives top-rated lookup. Use lazy deletion — validate the heap top against the live rating and pop stale entries on demand. Tuple ordering naturally handles the lex tie-break.",
    approach: "1. foodInfo: food → (cuisine, rating).\n2. heaps: cuisine → heap of (-rating, food).\n3. changeRating: update foodInfo, push new heap entry.\n4. highestRated: pop heap until top matches foodInfo.",
    solutionPython: `import heapq
from collections import defaultdict

class FoodRatings:
    def __init__(self, foods, cuisines, ratings):
        self.info = {}                       # food -> (cuisine, rating)
        self.heaps = defaultdict(list)       # cuisine -> heap of (-rating, food)
        for f, c, r in zip(foods, cuisines, ratings):
            self.info[f] = (c, r)
            heapq.heappush(self.heaps[c], (-r, f))

    def changeRating(self, food, newRating):
        c, _ = self.info[food]
        self.info[food] = (c, newRating)
        heapq.heappush(self.heaps[c], (-newRating, food))

    def highestRated(self, cuisine):
        h = self.heaps[cuisine]
        while True:
            negR, food = h[0]
            if -negR == self.info[food][1]:
                return food
            heapq.heappop(h)  # stale`,
    solutionCpp: `class FoodRatings {
    unordered_map<string, pair<string,int>> info; // food -> (cuisine, rating)
    unordered_map<string, set<pair<int,string>>> sets; // cuisine -> {(-rating, food)}
public:
    FoodRatings(vector<string>& foods, vector<string>& cuisines, vector<int>& ratings) {
        for (int i = 0; i < (int)foods.size(); i++) {
            info[foods[i]] = {cuisines[i], ratings[i]};
            sets[cuisines[i]].insert({-ratings[i], foods[i]});
        }
    }

    void changeRating(string food, int newRating) {
        auto& [c, r] = info[food];
        sets[c].erase({-r, food});
        r = newRating;
        sets[c].insert({-newRating, food});
    }

    string highestRated(string cuisine) {
        return sets[cuisine].begin()->second;
    }
};`,
    timeComplexity: "O(log N) per op",
    spaceComplexity: "O(N) (heap may grow with stale entries)",
    patternGuide: "Use **hashmap + per-key sorted structure (heap or TreeSet)** when:\n- Need both per-item lookup and per-group ranking\n- Ratings/priorities change frequently\n- Tuple ordering encodes tie-breakers cleanly\n\nSimilar: Design a Leaderboard, Stock Price Fluctuation, Trending Hashtags"
},
{
    id: 159,
    lcNumber: 641,
    title: "Design Circular Deque",
    difficulty: "Medium",
    category: "Design",
    description: "Implement a circular double-ended queue of fixed `k` capacity: `insertFront`, `insertLast`, `deleteFront`, `deleteLast`, `getFront`, `getRear`, `isEmpty`, `isFull`. All in O(1).",
    examples: [
        "MyCircularDeque(3)\ninsertLast(1) → true\ninsertLast(2) → true\ninsertFront(3) → true\ninsertFront(4) → false (full)\ngetRear() → 2\nisFull() → true\ndeleteLast() → true\ninsertFront(4) → true\ngetFront() → 4"
    ],
    thinkingProcess: [
        { step: "Why a fixed-size array, not a linked list", detail: "Linked list version is trivial but uses O(N) extra pointers and bad cache locality. Interviewers want the ring-buffer version: a fixed array + two indices." },
        { step: "Two indices: head and tail", detail: "`head` points to the current front element; `tail` points to ONE PAST the current rear (or to the slot where the next rear would go — convention varies). Track `size` separately to disambiguate empty vs full." },
        { step: "Modular arithmetic for circularity", detail: "All index moves go through `% capacity`. insertFront: `head = (head - 1 + cap) % cap`. insertLast: write at `tail`, then `tail = (tail + 1) % cap`. The `+ cap` handles negative wrap-around in C-like modulo." },
        { step: "Delete operations", detail: "deleteFront: `head = (head + 1) % cap`, --size. deleteLast: `tail = (tail - 1 + cap) % cap`, --size. Notice we don't need to clear the slot — it'll be overwritten on next insert." },
        { step: "getFront / getRear", detail: "Front element is `arr[head]`. Rear element is `arr[(tail - 1 + cap) % cap]` (the slot just before tail). Return -1 when empty." },
        { step: "Why track size explicitly", detail: "If `head == tail`, the deque could be either empty OR full. A separate `size` counter avoids this ambiguity. Alternative: leave one slot always empty, sacrificing capacity for simplicity." }
    ],
    keyInsight: "Ring buffer with two pointers (`head`, `tail`) and an explicit `size`. Every index move is `(idx ± 1 + cap) % cap`, giving O(1) ops with O(N) contiguous memory. The explicit `size` resolves the empty-vs-full ambiguity inherent in any single-pointer ring buffer.",
    approach: "1. arr[capacity] + head + tail + size.\n2. insertFront/Last: shift pointer, write, ++size.\n3. deleteFront/Last: shift pointer, --size.\n4. getFront/Rear: index via head / (tail-1+cap)%cap.",
    solutionPython: `class MyCircularDeque:
    def __init__(self, k):
        self.arr = [0] * k
        self.cap = k
        self.head = self.tail = 0
        self.size = 0

    def insertFront(self, value):
        if self.size == self.cap: return False
        self.head = (self.head - 1) % self.cap
        self.arr[self.head] = value
        self.size += 1
        return True

    def insertLast(self, value):
        if self.size == self.cap: return False
        self.arr[self.tail] = value
        self.tail = (self.tail + 1) % self.cap
        self.size += 1
        return True

    def deleteFront(self):
        if self.size == 0: return False
        self.head = (self.head + 1) % self.cap
        self.size -= 1
        return True

    def deleteLast(self):
        if self.size == 0: return False
        self.tail = (self.tail - 1) % self.cap
        self.size -= 1
        return True

    def getFront(self):
        return -1 if self.size == 0 else self.arr[self.head]

    def getRear(self):
        return -1 if self.size == 0 else self.arr[(self.tail - 1) % self.cap]

    def isEmpty(self): return self.size == 0
    def isFull(self):  return self.size == self.cap`,
    solutionCpp: `class MyCircularDeque {
    vector<int> arr;
    int cap, head = 0, tail = 0, sz = 0;
public:
    MyCircularDeque(int k) : arr(k), cap(k) {}

    bool insertFront(int v) {
        if (sz == cap) return false;
        head = (head - 1 + cap) % cap;
        arr[head] = v; sz++;
        return true;
    }
    bool insertLast(int v) {
        if (sz == cap) return false;
        arr[tail] = v;
        tail = (tail + 1) % cap; sz++;
        return true;
    }
    bool deleteFront() {
        if (!sz) return false;
        head = (head + 1) % cap; sz--;
        return true;
    }
    bool deleteLast() {
        if (!sz) return false;
        tail = (tail - 1 + cap) % cap; sz--;
        return true;
    }
    int getFront() { return sz ? arr[head] : -1; }
    int getRear()  { return sz ? arr[(tail - 1 + cap) % cap] : -1; }
    bool isEmpty() { return sz == 0; }
    bool isFull()  { return sz == cap; }
};`,
    timeComplexity: "O(1) per op",
    spaceComplexity: "O(k)",
    patternGuide: "Use **ring buffer (array + two pointers)** when:\n- Fixed-capacity FIFO/LIFO/deque\n- Need O(1) ops with cache-friendly contiguous memory\n- Streaming, audio buffers, producer/consumer queues\n\nSimilar: Design Circular Queue, Moving Average from Data Stream, Hit Counter"
},
{
    id: 160,
    lcNumber: 1244,
    title: "Design A Leaderboard",
    difficulty: "Medium",
    category: "Design",
    description: "Implement: `addScore(playerId, score)` (creates the player at this score, or adds delta to existing), `top(K)` (sum of top K scores), `reset(playerId)` (player's score to 0).",
    examples: [
        "addScore(1, 73), addScore(2, 56), addScore(3, 39), addScore(4, 51), addScore(5, 4)\ntop(1) → 73\nreset(1)         // player 1's score is now 0 (not removed)\nreset(2)\naddScore(2, 51)  // player 2 score = 51\ntop(3) → 141     // 51 + 51 + 39"
    ],
    thinkingProcess: [
        { step: "Two views of the same data", detail: "We need (a) per-player current score (for `addScore` deltas and `reset`) and (b) the scores in sorted order (for `top(K)`). Maintain both, kept in lockstep on every update." },
        { step: "Map: player → score", detail: "Trivially gives O(1) lookups for delta updates and reset. Reset just sets the score back to 0 (the problem treats 0 as 'inactive' for top-K aggregation since 0 contributes nothing)." },
        { step: "Sorted structure for top-K — choices", detail: "(a) **Sort on demand**: O(N log N) per `top(K)`. Acceptable for small N or rare top-K calls. (b) **SortedList / TreeMultiset**: insert/remove in O(log N), top-K is the first K elements in O(K). Best general solution." },
        { step: "addScore update flow", detail: "If player exists: remove old score from sorted structure, add `oldScore + delta`, update map. Else: insert score directly. Two log N operations per update." },
        { step: "reset flow", detail: "Same as addScore but explicitly setting score to 0: remove old score, insert 0 (or skip insert and treat absent as 0)." },
        { step: "Why not just a heap?", detail: "Heap supports top-K but not arbitrary-element removal (needed when a player's score changes). SortedList / TreeMap supports both." }
    ],
    keyInsight: "Maintain two synchronized structures: a HashMap (player → score) for O(1) lookup, and a SortedList of scores for O(log N) updates and O(K) top-K. Every score change is a remove-then-insert pair so both views stay consistent.",
    approach: "1. scores: player → current score.\n2. SortedList of all current scores.\n3. addScore: remove old, insert new.\n4. top(K): sum first K of sorted list.\n5. reset: same as addScore with target=0.",
    solutionPython: `from sortedcontainers import SortedList

class Leaderboard:
    def __init__(self):
        self.scores = {}                       # player -> score
        self.sl = SortedList()                 # all current scores

    def addScore(self, playerId, score):
        if playerId in self.scores:
            self.sl.remove(self.scores[playerId])
            self.scores[playerId] += score
        else:
            self.scores[playerId] = score
        self.sl.add(self.scores[playerId])

    def top(self, K):
        return sum(self.sl[-K:])

    def reset(self, playerId):
        self.sl.remove(self.scores[playerId])
        self.scores[playerId] = 0
        self.sl.add(0)`,
    solutionCpp: `class Leaderboard {
    unordered_map<int,int> scores;   // player -> score
    multiset<int> ms;                // all current scores
public:
    void addScore(int playerId, int score) {
        if (scores.count(playerId)) {
            ms.erase(ms.find(scores[playerId]));
            scores[playerId] += score;
        } else {
            scores[playerId] = score;
        }
        ms.insert(scores[playerId]);
    }

    int top(int K) {
        int sum = 0;
        auto it = ms.rbegin();
        while (K-- && it != ms.rend()) { sum += *it; ++it; }
        return sum;
    }

    void reset(int playerId) {
        ms.erase(ms.find(scores[playerId]));
        scores[playerId] = 0;
        ms.insert(0);
    }
};`,
    timeComplexity: "O(log N) addScore/reset, O(K) top",
    spaceComplexity: "O(N)",
    patternGuide: "Use **HashMap + sorted multiset/list** when:\n- Need both per-key updates and global ranking\n- Single value can change, requiring efficient remove+insert\n- Top-K queries are common\n\nSimilar: Food Rating System, Stock Price Fluctuation, Top K Frequent Elements"
},
];
